from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User
from app import db
from datetime import datetime, timedelta
import secrets
from flask_mail import Message
from app import mail

# Define the blueprint
users_bp = Blueprint('users', __name__)

# ----------------------------------
# Standard Authentication Endpoints
# ----------------------------------

@users_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'passenger')

    # Validate input
    if not all([name, email, password]):
        return jsonify({"msg": "Name, email, and password are required"}), 400

    # Check if email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 400

    # Hash password and create new user
    hashed_password = generate_password_hash(password)
    new_user = User(
        name=name,
        email=email,
        password=hashed_password,
        role=role,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201


@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"msg": "Email and password are required"}), 400

    # Fetch the user by email
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "Invalid credentials"}), 401

    # Verify the password
    if not check_password_hash(user.password, password):
        return jsonify({"msg": "Invalid credentials"}), 401

    # Generate access token
    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "msg": "Login successful"}), 200


@users_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # Note: Implement JWT revocation (blocklist) here if needed.
    return jsonify({"msg": "Logged out successfully"}), 200


# ---------------------------
# Forgot and Reset Password
# ---------------------------

@users_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"msg": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Generate a secure token and an expiry time (1 hour)
    reset_token = secrets.token_urlsafe(16)
    user.reset_token = reset_token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    db.session.commit()

    # Define the reset URL that your frontend will use (replace YOUR_FRONTEND_RESET_URL)
    reset_url = f"http://localhost:3000/reset-password?token={reset_token}"
    msg = Message("Password Reset Request", recipients=[user.email])
    msg.body = (
        f"Click the following link to reset your password: {reset_url}\n"
        "This link will expire in 1 hour."
    )
    mail.send(msg)

    return jsonify({"msg": "Password reset instructions sent to email"}), 200


@users_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    reset_token = data.get('reset_token')
    new_password = data.get('new_password')

    if not all([reset_token, new_password]):
        return jsonify({"msg": "Reset token and new password are required"}), 400

    # Find user by reset token
    user = User.query.filter_by(reset_token=reset_token).first()
    if not user:
        return jsonify({"msg": "Invalid reset token"}), 400

    # Check token expiry
    if user.reset_token_expires < datetime.utcnow():
        return jsonify({"msg": "Reset token has expired"}), 400

    # Update password and clear reset token
    user.password = generate_password_hash(new_password)
    user.reset_token = None
    user.reset_token_expires = None
    user.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"msg": "Password has been reset successfully"}), 200


# ---------------------------
# User Profile Endpoints
# ---------------------------

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "avatar": user.avatar,
        "bio": user.bio,
        "phone_number": user.phone_number,
        "address": user.address,
        "date_of_birth": user.date_of_birth,
        "created_at": user.created_at.isoformat(),
        "updated_at": user.updated_at.isoformat()
    }), 200


@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()
    user.bio = data.get('bio', user.bio)
    user.phone_number = data.get('phone_number', user.phone_number)
    user.address = data.get('address', user.address)
    user.avatar = data.get('avatar', user.avatar)
    user.updated_at = datetime.utcnow()

    db.session.commit()
    return jsonify({"msg": "Profile updated successfully"}), 200


@users_bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "Account deleted successfully"}), 200


@users_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    data = request.get_json()
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    if not all([old_password, new_password]):
        return jsonify({"msg": "Old and new passwords are required"}), 400

    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not check_password_hash(user.password, old_password):
        return jsonify({"msg": "Incorrect old password"}), 403

    user.password = generate_password_hash(new_password)
    user.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"msg": "Password changed successfully"}), 200
