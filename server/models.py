from datetime import datetime
from app import db
from sqlalchemy import (
    Column, Integer, String, ForeignKey, DateTime, Enum, Boolean, Float, Text
)
from sqlalchemy.orm import relationship,validates
import enum

# Base = declarative_base()

# Enums
class UserRole(enum.Enum):
    admin = "admin"
    company_owner = "company_owner"
    driver = "driver"
    passenger = "passenger"

class PaymentStatus(enum.Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"

class BookingStatus(enum.Enum):
    booked = "booked"
    cancelled = "cancelled"
    completed = "completed"

# Models
class User(db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    reset_token = Column(String(128), nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    avatar = Column(String, nullable=True)  # Path or URL to avatar image
    bio = Column(Text, nullable=True)  # User's biography
    phone_number = Column(String(20), nullable=True)  # User's phone number
    date_of_birth = Column(DateTime, nullable=True)  # User's date of birth
    address = Column(String, nullable=True)  # User's address
    created_at = Column(DateTime, default=datetime.utcnow)  # Automatically set when user is created
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Track last update

    company = relationship("BusCompany", back_populates="owner", uselist=False)
    bookings = relationship("Booking", back_populates="user")
    schedules = relationship("Schedule", back_populates="driver")

    # Optional: Adding validation for phone_number format (basic example)
    @validates('phone_number')
    def validate_phone_number(self, key, value):
        # Assuming a very basic phone number validation (you can use regex or other libraries for more sophisticated validation)
        if value and not value.isdigit():
            raise ValueError("Phone number must contain only digits.")
        return value

    # Method to update the profile (with avatar handling)
    def update_profile(self, bio=None, phone_number=None, address=None, avatar=None):
        if bio:
            self.bio = bio
        if phone_number:
            self.phone_number = phone_number
        if address:
            self.address = address
        if avatar:
            self.avatar = avatar  # Update avatar path or URL
        self.updated_at = datetime.utcnow()

class BusCompany(db.Model):
    __tablename__ = 'bus_companies'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)  # Name of the bus company
    logo = Column(String, nullable=True)  # Path or URL to the company logo
    contact_info = Column(Text, nullable=True)  # Contact information (email, phone, etc.)
    description = Column(Text, nullable=True)  # A brief description about the company
    address = Column(String, nullable=True)  # Physical address of the bus company
    website = Column(String, nullable=True)  # Website URL of the bus company
    created_at = Column(DateTime, default=datetime.utcnow)  # Timestamp when the company was created
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Timestamp when the company was last updated
    owner_id = Column(Integer, ForeignKey('users.id'))  # Foreign key to the User table (owner of the company)

    # Relationships
    owner = relationship("User", back_populates="company")
    buses = relationship("Bus", back_populates="company")

    # Optional: Add a method to update company details (similar to user profile update)
    def update_company(self, name=None, logo=None, contact_info=None, description=None, address=None, website=None):
        if name:
            self.name = name
        if logo:
            self.logo = logo
        if contact_info:
            self.contact_info = contact_info
        if description:
            self.description = description
        if address:
            self.address = address
        if website:
            self.website = website
        self.updated_at = datetime.utcnow()

class Bus(db.Model):
    __tablename__ = 'buses'

    id = Column(Integer, primary_key=True)
    company_id = Column(Integer, ForeignKey('bus_companies.id'))
    plate_number = Column(String, unique=True, nullable=False)
    bus_type = Column(String)
    seat_count = Column(Integer, nullable=False)
    amenities = Column(Text)  # e.g., WiFi, AC, etc.

    company = relationship("BusCompany", back_populates="buses")
    schedules = relationship("Schedule", back_populates="bus")
    seats = relationship("Seat", back_populates="bus")

class Route(db.Model):
    __tablename__ = 'routes'

    id = Column(Integer, primary_key=True)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    estimated_duration = Column(String)
    distance_km = Column(Float)

    schedules = relationship("Schedule", back_populates="route")

class Schedule(db.Model):
    __tablename__ = 'schedules'

    id = Column(Integer, primary_key=True)
    bus_id = Column(Integer, ForeignKey('buses.id'))
    route_id = Column(Integer, ForeignKey('routes.id'))
    driver_id = Column(Integer, ForeignKey('users.id'))
    departure_time = Column(DateTime, nullable=False)
    arrival_time = Column(DateTime, nullable=False)
    price = Column(Float, nullable=False)
    available_seats = Column(Integer)
    notes = Column(Text)

    bus = relationship("Bus", back_populates="schedules")
    route = relationship("Route", back_populates="schedules")
    driver = relationship("User", back_populates="schedules")
    bookings = relationship("Booking", back_populates="schedule")

class Booking(db.Model):
    __tablename__ = 'bookings'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    schedule_id = Column(Integer, ForeignKey('schedules.id'))
    seats_booked = Column(Integer, nullable=False)
    status = Column(Enum(BookingStatus), default=BookingStatus.booked)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.pending)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="bookings")
    schedule = relationship("Schedule", back_populates="bookings")
    payment = relationship("Payment", back_populates="booking", uselist=False)

class Payment(db.Model):
    __tablename__ = 'payments'

    id = Column(Integer, primary_key=True)
    booking_id = Column(Integer, ForeignKey('bookings.id'))
    amount = Column(Float, nullable=False)
    payment_method = Column(String, nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.pending)
    timestamp = Column(DateTime, default=datetime.utcnow)

    booking = relationship("Booking", back_populates="payment")

class Seat(db.Model):
    __tablename__ = 'seats'

    id = Column(Integer, primary_key=True)
    bus_id = Column(Integer, ForeignKey('buses.id'))
    seat_number = Column(String, nullable=False)
    layout = Column(String)  # e.g., A1, A2
    is_window = Column(Boolean, default=False)

    bus = relationship("Bus", back_populates="seats")

