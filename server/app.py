import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)

# Set up the database configuration with your PostgreSQL URL
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL") or \
    'postgresql://neondb_owner:npg_WjpNFAZcls78@ep-wandering-haze-a5isoc9t-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Example model definition
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f'<User {self.name}>'

@app.route('/')
def index():
    return 'Hello, World!'

if __name__ == '__main__':
    # Create tables if they don't exist yet
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=False)