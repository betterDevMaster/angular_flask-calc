#!/usr/bin/python
# -*- coding: utf-8 -*-

from datetime import datetime

from flask import g

from api.conf.auth import auth, jwt
from api.database.database import db
from sqlalchemy.orm import relationship
import enum


class UserRole(enum.Enum):
    individual = "Individual"
    content = "Content Provider"
    both = "Both"
    admin = "Admin"


class User(db.Model):

    # Generates default class name for table. For changing use
    __tablename__ = 'users'

    # User id.
    id = db.Column(db.Integer, primary_key=True)
    # User email address.
    email = db.Column(db.String(length=80))
    # User password.
    password = db.Column(db.String(length=80))
    # First name.
    first_name = db.Column(db.String(length=80))
    # Last name.
    last_name = db.Column(db.String(length=80))
    # Unless otherwise stated default role is user.
    user_role = db.Column(db.Enum(UserRole))
    # User country.
    user_country = db.Column(db.Integer, db.ForeignKey('countries.id'))
    # User language.
    user_language = db.Column(db.Integer, db.ForeignKey('languages.id'))
    # Street
    street = db.Column(db.Text)
    # Nr
    nr = db.Column(db.String(length=80))
    # Zipcode
    zipcode = db.Column(db.String(length=80))
    # City
    city = db.Column(db.Text)
    # status.
    confirmed = db.Column(db.Boolean)
    # Creation time for languages.
    confirmed_on = db.Column(db.DateTime)
    # Creation time for user.
    created = db.Column(db.DateTime, default=datetime.utcnow)
    # Relationships
    languages = relationship("Language")
    countries = relationship("Country")
    # Generates auth token.

    def generate_auth_token(self, permission_level):

        # Check if admin.
        if permission_level == 1:

            # Generate admin token with flag 1.
            token = jwt.dumps({'email': self.email, 'admin': 1})

            # Return admin flag.
            return token

            # Check if admin.
        elif permission_level == 2:

            # Generate admin token with flag 1.
            token = jwt.dumps({'email': self.email, 'admin': 2})

            # Return admin flag.
            return token

        # Return normal user flag.
        return jwt.dumps({'email': self.email, 'admin': 0})

    # Generates a new access token from refresh token.
    @staticmethod
    @auth.verify_token
    def verify_auth_token(token):

        # Create a global none user.
        g.user = None

        try:
            # Load token.
            data = jwt.loads(token)

        except:
            # If any error return false.
            return False

        # Check if email and admin permission variables are in jwt.
        if 'email' and 'admin' in data:

            # Set email from jwt.
            g.user = data['email']

            # Set admin permission from jwt.
            g.admin = data['admin']

            # Return true.
            return True

        # If does not verified, return false.
        return False

    def __repr__(self):

        # This is only for representation how you want to see user information after query.
        return "<User(id='%d', email='%s', first_name='%s', last_name='%s',  user_role='%s', user_country='%d', user_language='%d', street='%s', nr='%s', zipcode='%s', city='%s', confirmed='%d', confirmed_on='%s', created='%s')>" % (
            self.id, self.email, self.first_name, self.last_name, self.user_role, self.user_country, self.user_language, self.street, self.nr, self.zipcode, self.city, self.confirmed, self.confirmed_on, self.created)


class Blacklist(db.Model):

    # Generates default class name for table. For changing use
    # __tablename__ = 'users'

    # Blacklist id.
    id = db.Column(db.Integer, primary_key=True)

    # Blacklist invalidated refresh tokens.
    refresh_token = db.Column(db.String(length=255))

    def __repr__(self):

        # This is only for representation how you want to see refresh tokens after query.
        return "<User(id='%s', refresh_token='%s', status='invalidated.')>" % (
            self.id, self.refresh_token)


class Language(db.Model):

    __tablename__ = "languages"  # table name will default to name of the model

    # Create Columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # language name
    name = db.Column(db.String(length=120))
    # language foreign name
    foreign = db.Column(db.String(length=120))
    # flag info
    flag = db.Column(db.Text)
    # status.
    status = db.Column(db.Boolean)
    # Creation time for languages.
    created = db.Column(db.DateTime, default=datetime.utcnow)
    # # set relationship
    # languages = db.relationship('LanguageDetail', backref='languages', lazy=True)
    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.

    def __repr__(self):
        return "<Language(id='%s', name='%s', foreign='%s', status='%r', created='%s')>" % (
            self.id, self.name, self.foreign, self.status, self.created)


class Page(db.Model):

    __tablename__ = "pages"  # table name will default to name of the model

    # Create Columns
    id = db.Column(db.Integer, primary_key=True)
    # page name
    name = db.Column(db.String(length=120))
    # Creation time for page.
    created = db.Column(db.DateTime, default=datetime.utcnow)
    # set relationship
    pages = db.relationship('LanguageDetail', backref='pages', lazy=True)

    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.
    def __repr__(self):
        return "<Page(id='%s', name='%s', created='%s')>" % (
            self.id, self.name, self.created)


class LanguageDetail(db.Model):

    __tablename__ = "language_details"  # table name will default to name of the model

    # Create Columns
    id = db.Column(db.Integer, primary_key=True)
    # page id
    page_id = db.Column(db.Integer, db.ForeignKey('pages.id'))
    # language id
    lang_id = db.Column(db.Integer, db.ForeignKey('languages.id'))
    # language content
    content = db.Column(db.Text)
    # language content translated
    translate = db.Column(db.Text)
    # Creation time for language details.
    created = db.Column(db.DateTime, default=datetime.utcnow)

    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.
    def __repr__(self):
        return "<LanguageDetail(id='%s', page_id='%d', lang_id='%d', content='%s', translate='%s')>" % (
            self.id, self.page_id, self.lang_id, self.content, self.translate)


class Country(db.Model):

    __tablename__ = "countries"  # table name will default to name of the model

    # Create Columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # name
    name = db.Column(db.String(length=120))
    # currency
    currency = db.Column(db.String(length=50))
    # fx
    fx = db.Column(db.String(length=50))
    # land_register
    land_register = db.Column(db.Float)
    # light_of_lien
    right_of_lien = db.Column(db.Float)
    # solvency
    solvency = db.Column(db.Float)
    # abstract_lr
    abstract_lr = db.Column(db.Float)
    # valuation_fee
    valuation_fee = db.Column(db.Float)
    # solvency_rate
    solvency_rate = db.Column(db.Float)
    # reference_1
    reference_1 = db.Column(db.Float)
    # reference_2
    reference_2 = db.Column(db.Float)
    # stamp_duty
    stamp_duty = db.Column(db.Float)
    # country_costs
    country_costs = db.Column(db.Float)
    # created
    created = db.Column(db.DateTime, default=datetime.utcnow)
    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.

    def __repr__(self):
        return "<Country(id='%s', name='%s', currency='%s', fx='%s', land_register='%f', right_of_lien='%f', solvency='%f', abstract_lr='%f', valuation_fee='%f', solvency_rate='%f', reference_1='%f', reference_2='%f', stamp_duty='%f', country_costs='%f')>" % (
            self.id, self.name, self.currency, self.fx, self.land_register, self.right_of_lien, self.solvency, self.abstract_lr, self.valuation_fee, self.solvency_rate, self.reference_1, self.reference_2, self.stamp_duty, self.country_costs)


class VariantType(enum.Enum):
    interest_accepted_fixed = "Fixed"
    interest_accepted_variable = "Variant"
    interest_accepted_both = "Both"


class ReferenceRate(enum.Enum):
    interest_reference_1 = "Reference rate 1"
    interest_reference_2 = "Reference rate 2"


class Address(enum.Enum):
    all_countries = "All countries"
    individual_countries = "Individual countries"


class RangeName(enum.Enum):
    funding = "Funding"
    purchasing = "Purchasing"
    loan_amount = "Loan Amount"
    loan_term = "Loan Term"
    age = "Age"
    kids = "Kids"


class GuarantorType(enum.Enum):
    self_funds = "Self funds"
    guarantor = "Guarantor"
    combined = "Combined"


class ReductionType(enum.Enum):
    purpose = "Purpose"
    type_property = "type_property"
    purchasing_price = "Purchasing price"
    employment_type = "Employment Type"
    martial_status = "Material Status"
    age = "Age"
    net_income = "Net income"
    highest_degree = "Highest degree"
    field_work = "Field of work"
    job_position = "Job position"
    kids = "Number of kids"


class ContentCategory(enum.Enum):
    contents = "Content"
    content_guarantors = "ContentGuarantor"
    content_ranges = "ContentRange"
    content_reductions = "ContentReduction"
    content_surcharges = "ContentSurcharge"


class Content(db.Model):
    __tablename__ = "contents"  # table name will default to name of the model

    # Create Columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # User id
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    # Interest variant
    interest_accepted = db.Column(db.Enum(VariantType))
    # Interest reference
    interest_reference = db.Column(db.Enum(ReferenceRate))
    # Interest fixed rate
    interest_fixed = db.Column(db.Float)
    # Interest surcharges
    interest_surcharge = db.Column(db.Text)
    # Interest internal costs
    internal_val = db.Column(db.Float)
    # Funding case min
    funding_case_min = db.Column(db.Float)
    # Funding case max
    funding_case_max = db.Column(db.Float)
    # Purpose
    purpose = db.Column(db.Text)
    # Type of property
    type_property = db.Column(db.Text)
    # Purchasing min
    purchasing_min = db.Column(db.Float)
    # Purchasing max
    purchasing_max = db.Column(db.Float)
    # Purchasing price/Property Reduction starting
    purchasing_reduction_starting = db.Column(db.Float)
    # Purchasing reduction
    purchasing_reduction = db.Column(db.Float)
    # Loan amount min
    loan_amount_min = db.Column(db.Float)
    # Loan amount max
    loan_amount_max = db.Column(db.Float)
    # Loan term min
    loan_term_min = db.Column(db.Float)
    # Loan term max
    loan_term_max = db.Column(db.Float)
    # Employment type
    employment_type = db.Column(db.Text)
    # Martial status
    martial_status = db.Column(db.Text)
    # Age min
    age_min = db.Column(db.Integer)
    # Age max
    age_max = db.Column(db.Integer)
    # age
    age = db.Column(db.Text)
    # Net income min
    net_min = db.Column(db.Float)
    # Net income not accepted ratio
    net_not_ratio = db.Column(db.Float)
    # Net
    net = db.Column(db.Text)
    # Highest degree
    highest_degree = db.Column(db.Text)
    # Field of work
    field_work = db.Column(db.Text)
    # Job position
    job_position = db.Column(db.Text)
    # kids min
    kids_min = db.Column(db.Float)
    # kids max
    kids_max = db.Column(db.Float)
    # kids
    kids = db.Column(db.Text)
    # address scope
    address_scope = db.Column(db.Enum(Address))
    # Country
    country_id = db.Column(db.Text)
    # Self required
    self_required = db.Column(db.Boolean)
    # Self min
    self_min = db.Column(db.Float)
    # Self funds
    self_funds = db.Column(db.Text)
    # Guarantor required
    guarantor_required = db.Column(db.Boolean)
    # Guarantor min
    guarantor_min = db.Column(db.Float)
    # Guarantor
    guarantor = db.Column(db.Text)
    # Combined required
    combined_required = db.Column(db.Boolean)
    # Combined min
    combined_min = db.Column(db.Float)
    # Combined
    combined = db.Column(db.Text)
    # created
    created = db.Column(db.DateTime, default=datetime.utcnow)
    # users = relationship("User")
    # countries = relationship("")
    # set relationship
    # countries = db.relationship('User', backref='countries', lazy=True)

    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.
    def __repr__(self):
        return "<Content(user_id='%d', interest_accepted='%s', interest_reference='%s', interest_fixed='%f', interest_surcharge='%s', internal_val='%f', funding_case_min='%f', funding_case_max='%f', purpose='%s', type_property='%s', purchasing_min='%f', purchasing_max='%f', purchasing_reduction_starting='%s', purchasing_reduction='%s', loan_amount_min='%f', loan_amount_max='%f', loan_term_min='%f', loan_term_max='%f', employment_type='%s', martial_status='%s', age_min='%d', age_max='%d', age='%s', net_min='%f', net_not_ratio='%f', net='%s', highest_degree='%s', field_work='%s', job_position='%s', kids_min='%f', kids_max='%f', kids='%s', address_scope='%s', country_id='%s', self_required='%d', self_min='%f', self_funds='%s', guarantor_required='%d', guarantor_min='%f', guarantor='%s', combined_required='%d', combined_min='%f', combined='%s')>" % (self.user_id, self.interest_accepted, self.interest_reference, self.interest_fixed, self.interest_surcharge, self.internal_val, self.funding_case_min, self.funding_case_max, self.purpose, self.type_property, self.purchasing_min, self.purchasing_max, self.purchasing_reduction_starting, self.purchasing_reduction, self.loan_amount_min, self.loan_amount_max, self.loan_term_min, self.loan_term_max, self.employment_type, self.martial_status, self.age_min, self.age_max, self.age, self.net_min, self.net_not_ratio, self.net, self.highest_degree, self.field_work, self.job_position, self.kids_min, self.kids_max, self.kids, self.address_scope, self.country_id, self.self_required, self.self_min, self.self_funds, self.guarantor_required, self.guarantor_min, self.guarantor, self.combined_required, self.combined_min, self.combined)


class ContentName(db.Model):

    __tablename__ = "content_names"  # table name will default to name of the model

    # Create Columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # name
    name = db.Column(db.String(length=80))
    # value
    val = db.Column(db.String(length=80))
    # level
    level = db.Column(db.Integer)
    # Parent id
    parent_id = db.Column(db.Integer)
    # category
    category = db.Column(db.Enum(ContentCategory))
    # type
    variety = db.Column(db.String(length=80))
    # language enalbed
    lang_need = db.Column(db.Boolean)
    # page
    page = db.Column(db.String(length=80))
    # created
    created = db.Column(db.DateTime, default=datetime.utcnow)

    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.
    def __repr__(self):
        return "<ContentName(id='%s', name='%s', val='%s' level='%d', parent_id='%d', category='%s', variety='%s')>" % (
            self.id, self.name, self.val, self.level, self.parent_id, self.category, self.variety)


class LanguageComponent(db.Model):

    # table name will default to name of the model
    __tablename__ = "language_components"

    # Create Columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # language id
    lang_id = db.Column(db.Integer, db.ForeignKey('languages.id'))
    # category
    category = db.Column(db.String(length=80))
    # page
    page = db.Column(db.String(length=80))
    # name
    name = db.Column(db.String(length=80))
    # value
    val = db.Column(db.Text)

    # created
    created = db.Column(db.DateTime, default=datetime.utcnow)

    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.
    def __repr__(self):
        return "<LanguageComponent(id='%s', lang_id='%d', category='%s', page='%d', name='%d', val='%s')>" % (
            self.id, self.lang_id, self.category, self.page, self.name, self.val)


class IndBasisModel(db.Model):

    __tablename__ = "individual_basis"  # table name will default to name of the model

    # Create Columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # User id
    user_id = db.Column(db.Integer)
    # purpose
    purpose = db.Column(db.String(length=80))
    # type of property
    type_property = db.Column(db.String(length=80))
    # Purchasing price/Property value
    purchasing = db.Column(db.Float)
    # Loan amount required
    loan_amount = db.Column(db.Float)
    # Interest rate variant
    interest_variant = db.Column(db.String(length=80))
    # Loan terms(years)
    loan_term = db.Column(db.Integer)
    # Employment type
    employment_type = db.Column(db.String(length=80))
    # Preferred payout date
    preferred_date = db.Column(db.String(length=80))
    # created
    created = db.Column(db.DateTime, default=datetime.utcnow)

    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.
    def __repr__(self):
        return "<IndBasisModel(id='%d', user_id='%d' purpose='%s', type_property='%s', purchasing='%f', loan_amount='%f', interest_variant='%s', loan_term='%d', employment_type='%s', preferred_date='%s')>" % (
            self.id, self.user_id, self.purpose, self.type_property, self.purchasing, self.loan_amount, self.interest_variant, self.loan_term, self.employment_type, self.preferred_date)


class IndIndividualModel(db.Model):

    # table name will default to name of the model
    __tablename__ = "individual_individual"

    # Create Columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # User id
    user_id = db.Column(db.Integer)
    # purpose
    martial_status = db.Column(db.String(length=80))
    # type of property
    age = db.Column(db.String(length=80))
    # Purchasing price/Property value
    net_income = db.Column(db.String(length=80))
    # Loan amount required
    highest_degree = db.Column(db.String(length=80))
    # Interest rate variant
    field_work = db.Column(db.String(length=80))
    # Loan terms(years)
    job_position = db.Column(db.String(length=80))
    # Kids
    kids = db.Column(db.String(length=80))
    # Address
    address = db.Column(db.Text)
    # Own funds
    own_funds = db.Column(db.String(length=80))
    # Guarantor
    guarantor = db.Column(db.String(length=80))
    # created
    created = db.Column(db.DateTime, default=datetime.utcnow)

    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.
    def __repr__(self):
        return "<IndIndividualModel(id='%d', martial_status='%s', age='%s', net_income='%f', highest_degree='%f', field_work='%s', job_position='%d', number_kids='%s', address='%d', own_funds='%d', guarantor='%d')>" % (
            self.id, self.martial_status, self.age, self.net_income, self.highest_degree, self.field_work, self.job_position, self.number_kids, self.address, self.own_funds, self.guarantor)


class IndSpecialModel(db.Model):

    # table name will default to name of the model
    __tablename__ = "individual_special"

    # Create Columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # User id
    user_id = db.Column(db.Integer)
    # Natural disasters
    natural_disasters = db.Column(db.Text)
    # Areas
    areas = db.Column(db.Text)
    # Additions
    additions = db.Column(db.Text)
    # created
    created = db.Column(db.DateTime, default=datetime.utcnow)

    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.
    def __repr__(self):
        return "<IndSpecialModel(id='%d', natural_disasters='%s', areas='%s', additions='%s')>" % (
            self.id, self.natural_disasters, self.areas, self.additions)


class IndHouseholdModel(db.Model):

    # table name will default to name of the model
    __tablename__ = "individual_household"

    # Create Columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # User id
    user_id = db.Column(db.Integer)
    # Income/Earnings
    income = db.Column(db.Text)
    # Expenses
    expenses = db.Column(db.Text)
    # Mobility
    mobility = db.Column(db.Text)
    # Insurances
    insurances = db.Column(db.Text)
    # Other expenses
    other_expenses = db.Column(db.Text)
    # Existing assets
    existing_assets = db.Column(db.Text)
    # created
    created = db.Column(db.DateTime, default=datetime.utcnow)

    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.
    def __repr__(self):
        return "<IndHouseholdModel(id='%d', income='%s', expenses='%s', mobility='%s', insurances='%s', other_expenses='%s', existing_assets='%s', variable_universal='%s')>" % (
            self.id, self.natural_disasters, self.areas, self.additions)


class IndLivingspaceModel(db.Model):

    # table name will default to name of the model
    __tablename__ = "individual_livingspace"

    # Create Columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # User id
    user_id = db.Column(db.Integer)
    # Floor name
    no = db.Column(db.Integer)
    # Floor value
    val = db.Column(db.Text)
    # created
    created = db.Column(db.DateTime, default=datetime.utcnow)

    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.
    def __repr__(self):
        return "<IndLivingspaceModel(id='%d', no='%d', val='%s')>" % (
            self.id, self.no, self.val)


class IndProjectModel(db.Model):

    # table name will default to name of the model
    __tablename__ = "individual_project"

    # Create Columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # User id
    user_id = db.Column(db.Integer)
    # Housebuilding
    housebuilding = db.Column(db.Text)
    # Basement
    basement = db.Column(db.Text)
    # ground
    ground = db.Column(db.Text)
    # Exterior
    exterior = db.Column(db.Text)
    # Independent Costs
    independent = db.Column(db.Text)
    # created
    created = db.Column(db.DateTime, default=datetime.utcnow)

    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.
    def __repr__(self):
        return "<IndProjectModel(id='%d', housebuilding='%s', basement='%s', exterior='%s', independent='%s')>" % (
            self.id, self.housebuilding, self.basement, self.exterior, self.independent)


class IndDocumentsModel(db.Model):

    # table name will default to name of the model
    __tablename__ = "individual_documents"

    # Create Columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # User id
    user_id = db.Column(db.Integer)
    # Identification
    identification = db.Column(db.Text)
    # Statement of bank account
    statement_bank = db.Column(db.Text)
    # Pay slip/proof of income
    pay_slip = db.Column(db.Text)
    # Proof of assets
    proof_assets = db.Column(db.Text)
    # House offer
    house_offer = db.Column(db.Text)
    # Basement/ Foundation/ Callar offer
    basement = db.Column(db.Text)
    # ID guarantor
    id_guarantor = db.Column(db.Text)
    # Proof of assets guarantor
    proof_guarantor = db.Column(db.Text)
    # Deed of suretyship
    deed_suretyship = db.Column(db.Text)
    # created
    created = db.Column(db.DateTime, default=datetime.utcnow)

    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.
    def __repr__(self):
        return "<IndDocumentsModel(id='%d', identification='%s', statement_bank='%s', pay_slip='%s', proof_assets='%s', house_offer='%s', basement='%s', id_guarantor='%s', proof_guarantor='%s', deed_suretyship='%s')>" % (
            self.id, self.identification, self.statement_bank, self.pay_slip, self.proof_assets, self.house_offer, self.basement, self.id_guarantor, self.proof_guarantor, self.deed_suretyship)


class StressScenarioModel(db.Model):

    # table name will default to name of the model
    __tablename__ = "stressScenario"

    # Create Columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # User id
    remainingsp = db.Column(db.Float)
    remaininghorizon = db.Column(db.Integer)
    lendingrate = db.Column(db.Float)
    sp = db.Column(db.Float)
    horizon = db.Column(db.Integer)
    # created
    created = db.Column(db.DateTime, default=datetime.utcnow)

    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.
    def __repr__(self):
        return "<StressScenarioModel(id='%d', remainingsp='%s', remaininghorizon='%s', lendingrate='%s', sp='%s', horizon='%s')>" % (
            self.id, self.remainingsp, self.remaininghorizon, self.lendingrate, self.sp, self.horizon)


class UserStressScenarioModel(db.Model):

    # table name will default to name of the model
    __tablename__ = "userStressScenario"

    # Create Columns
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # User id
    startDate = db.Column(db.String(length=80))
    endDate = db.Column(db.String(length=80))
    userId = db.Column(db.Integer)
    interest = db.Column(db.Float)
    rates = db.Column(db.Text)
    low = db.Column(db.Float)
    high = db.Column(db.Float)
    annuity = db.Column(db.Float)
    totalAddition = db.Column(db.Float)
    # created
    created = db.Column(db.DateTime, default=datetime.utcnow)

    # this is not essential, but a valuable method to overwrite as this is what we will see when we print out an instance in a REPL.
    def __repr__(self):
        return "<UserStressScenarioModel(id='%d', startDate='%s', endDate='%s', userId='%d', rates='%s', interest='%s', low='%s', high='%s', annuity='%s', totalAddition='%d')>" % (
            self.id, self.startDate, self.endDate, self.userId, self.rates, self.interest, self.low, self.high, self.annuity, self.totalAddition)
