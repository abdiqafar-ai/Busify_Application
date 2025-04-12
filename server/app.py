import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail 

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL") or \
        'postgresql://neondb_owner:npg_WjpNFAZcls78@ep-wandering-haze-a5isoc9t-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get("JWT_SECRET_KEY", "your_jwt_secret")
    
    # Email configuration
    app.config['MAIL_SERVER'] = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
    app.config['MAIL_PORT'] = int(os.environ.get("MAIL_PORT", 587))
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.environ.get("MAIL_USERNAME", "abdiqafar.ibrahim@student.moringaschool.com")
    app.config['MAIL_PASSWORD'] = os.environ.get("MAIL_PASSWORD", "ogng foil pvtp jxvj")
    app.config['MAIL_DEFAULT_SENDER'] = os.environ.get("MAIL_DEFAULT_SENDER", "abdiqafar.ibrahim@student.moringaschool.com")
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    CORS(app)

    # Import models after db initialization to avoid circular imports
    with app.app_context():
        from models import User, BusCompany, Bus, Route, Schedule, Booking, Payment, Seat
        db.create_all()  # Create tables if they don't exist

    # Register blueprints
    register_blueprints(app)

    @app.route('/')
    def home():
        return 'Bus Booking API'

    return app

def register_blueprints(app):
    from routes.users import users_bp
    from routes.buses import buses_bp
    from routes.companies import companies_bp
    from routes.routes import routes_bp
    from routes.schedules import schedules_bp
    from routes.bookings import bookings_bp
    from routes.payments import payments_bp
    from routes.seats import seats_bp

    app.register_blueprint(users_bp)
    app.register_blueprint(buses_bp)
    app.register_blueprint(companies_bp)
    app.register_blueprint(routes_bp)
    app.register_blueprint(schedules_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(seats_bp)

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)