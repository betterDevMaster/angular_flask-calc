#!/usr/bin/python
# -*- coding: utf-8 -*-

from marshmallow import Schema, fields
from marshmallow_enum import EnumField
from enum import Enum


class UserRole(Enum):
    individual = "Individual"
    content = "Content Provider"
    both = "Both"
    admin = "Admin"


class ContentCategory():
    contents = "Content"
    content_guarantors = "ContentGuarantor"
    content_ranges = "ContentRange"
    content_reductions = "ContentReduction"
    content_surcharges = "ContentSurcharge"


class BaseUserSchema(Schema):

    """
        Base user schema returns all fields but this was not used in user handlers.
    """

    # Schema parameters.

    id = fields.Int(dump_only=True)
    user_country = fields.Int()
    user_language = fields.Int()
    # username = fields.Str()
    email = fields.Str()
    password = fields.Str()
    created = fields.Str()
    # user_role = fields.Str()
    user_role = EnumField(UserRole)


class UserSchema(Schema):
    """
        User schema returns only username, email and creation time. This was used in user handlers.
    """

    # Schema parameters.
    id = fields.Int(dump_only=True)
    # username = fields.Str()
    email = fields.Str()
    first_name = fields.Str()
    last_name = fields.Str()
    user_role = EnumField(UserRole)
    user_country = fields.Int()
    user_language = fields.Int()
    language = fields.Str()
    country = fields.Str()
    street = fields.Str()
    nr = fields.Str()
    zipcode = fields.Str()
    city = fields.Str()
    confirmed = fields.Boolean()
    confirmed_on = fields.DateTime()


class LanguageSchema(Schema):
    """
        Language schema
    """

    # Schema parameters.
    id = fields.Int(dump_only=True)
    name = fields.Str()
    foreign = fields.Str()
    flag = fields.Str()
    status = fields.Boolean()


class LanguageDetailSchema(Schema):
    """
        Language schema
    """

    # Schema parameters.
    id = fields.Int(dump_only=True)
    language_id = fields.Int()
    page_id = fields.Int()
    lang_id = fields.Int()
    content = fields.Str()
    translate = fields.Str()


class LanguageComponentSchema(Schema):
    """
        Language schema
    """

    # Schema parameters.
    id = fields.Int(dump_only=True)
    lang_id = fields.Int()
    category = fields.Str()
    page = fields.Str()
    name = fields.Str()
    val = fields.Str()


class CountrySchema(Schema):
    """
        Country schema
    """

    # Schema parameters.
    id = fields.Int(dump_only=True)
    name = fields.Str()
    currency = fields.Str()
    fx = fields.Str()
    land_register = fields.Float()
    right_of_lien = fields.Float()
    solvency = fields.Float()
    abstract_lr = fields.Float()
    valuation_fee = fields.Float()
    solvency_rate = fields.Float()
    reference_1 = fields.Float()
    reference_2 = fields.Float()
    stamp_duty = fields.Float()
    country_costs = fields.Float()


class ContentNameSchema(Schema):
    """
        ContentName schema
    """

    # Schema parameters.
    id = fields.Int(dump_only=True)
    name = fields.Str()
    val = fields.Str()
    level = fields.Int()
    parent_id = fields.Int()
    category = EnumField(ContentCategory)
    lang_need = fields.Boolean()
    variety = fields.Str()
    page = fields.Str()


class VariantType(Enum):
    interest_accepted_fixed = "Fixed"
    interest_accepted_variable = "Variant"
    interest_accepted_both = "Both"


class ReferenceRate(Enum):
    interest_reference_1 = "Reference rate 1"
    interest_reference_2 = "Reference rate 2"


class Address(Enum):
    all_countries = "All countries"
    individual_countries = "Individual countries"


class ContentSchema(Schema):
    """
        Content schema
    """
    # Schema parameters.
    user_id = fields.Int()
    interest_accepted = EnumField(VariantType)
    interest_reference = EnumField(ReferenceRate)
    interest_fixed = fields.Float()
    interest_surcharge = fields.Str()
    internal_val = fields.Float()
    funding_case_min = fields.Float()
    funding_case_max = fields.Float()
    purpose = fields.Str()
    type_property = fields.Str()
    purchasing_min = fields.Float()
    purchasing_max = fields.Float()
    purchasing_reduction_starting = fields.Float()
    purchasing_reduction = fields.Float()
    loan_amount_min = fields.Float()
    loan_amount_max = fields.Float()
    loan_term_min = fields.Float()
    loan_term_max = fields.Float()
    employment_type = fields.Str()
    martial_status = fields.Str()
    age_min = fields.Int()
    age_max = fields.Int()
    age = fields.Str()
    net_min = fields.Float()
    net_not_ratio = fields.Float()
    net = fields.Str()
    highest_degree = fields.Str()
    field_work = fields.Str()
    job_position = fields.Str()
    kids_min = fields.Float()
    kids_max = fields.Float()
    kids = fields.Str()
    address_scope = EnumField(Address)
    country_id = fields.Str()
    self_required = fields.Int()
    self_min = fields.Float()
    self_funds = fields.Str()
    guarantor_required = fields.Int()
    guarantor_min = fields.Float()
    guarantor = fields.Str()
    combined_required = fields.Int()
    combined_min = fields.Float()
    combined = fields.Str()


class ContentSurchargeSchema(Schema):
    """
        ContentSurcharge schema
    """

    # Schema parameters.
    name = fields.Str()
    status = fields.Boolean()
    val = fields.Float()


class ContentReductionSchema(Schema):
    """
        ContentReduction schema
    """
    # Schema parameters.
    name = fields.Str()
    val = fields.Str()


class ContentRangeSchema(Schema):
    """
        ContentRange schema
    """
    # Schema parameters.
    name = fields.Str()
    val = fields.Float()


class ContentGuarantorSchema(Schema):
    """
        ContentGuarantorSchema schema
    """
    # Schema parameters.
    name = fields.Str()
    required = fields.Boolean()
    mini = fields.Float()
    until_1 = fields.Float()
    reduction_1 = fields.Float()
    until_2 = fields.Float()
    reduction_2 = fields.Float()
    until_3 = fields.Float()
    reduction_3 = fields.Float()
    until_4 = fields.Float()
    reduction_4 = fields.Float()
    until_5 = fields.Float()
    reduction_5 = fields.Float()
    reduction_to = fields.Int()


class IndividualBasisSchema(Schema):
    """
        IndividualBasis schema
    """
    # Schema parameters.
    user_id = fields.Int()
    purpose = fields.Str()
    type_property = fields.Str()
    purchasing = fields.Float()
    loan_amount = fields.Float()
    interest_variant = fields.Str()
    interest_rate = fields.Str()
    loan_term = fields.Int()
    employment_type = fields.Str()
    preferred_date = fields.Str()


class IndividualIndividualSchema(Schema):
    """
        IndividualIndividual schema
    """
    # Schema parameters.
    user_id = fields.Int()
    martial_status = fields.Str()
    age = fields.Str()
    net_income = fields.Str()
    highest_degree = fields.Str()
    field_work = fields.Str()
    job_position = fields.Str()
    kids = fields.Str()
    address = fields.Str()
    own_funds = fields.Str()
    guarantor = fields.Str()


class IndividualSpecialSchema(Schema):
    """
        IndividualIndividual schema
    """
    # Schema parameters.
    natural_disasters = fields.Str()
    areas = fields.Str()
    additions = fields.Str()


class IndividualHouseholdSchema(Schema):
    """
        IndividualIndividual schema
    """
    # Schema parameters.
    income = fields.Str()
    insurances = fields.Str()
    expenses = fields.Str()
    other_expenses = fields.Str()
    mobility = fields.Str()
    existing_assets = fields.Str()


class IndividualLivingspaceSchema(Schema):
    """
        IndividualIndividual schema
    """
    # Schema parameters.
    no = fields.Int()
    val = fields.Str()


class IndividualProjectcostSchema(Schema):
    """
        IndividualIndividual schema
    """
    # Schema parameters.
    housebuilding = fields.Str()
    basement = fields.Str()
    ground = fields.Str()
    exterior = fields.Str()
    independent = fields.Str()


class IndividualDocumentsSchema(Schema):
    """
        IndividualIndividual schema
    """
    # Schema parameters.
    identification = fields.Str()
    statement_bank = fields.Str()
    pay_slip = fields.Str()
    proof_assets = fields.Str()
    house_offer = fields.Str()
    basement = fields.Str()
    id_guarantor = fields.Str()
    proof_guarantor = fields.Str()
    deed_suretyship = fields.Str()


class StressScenarioSchema(Schema):
    """
        StressScenario schema
    """
    remainingsp = fields.Float()
    remaininghorizon = fields.Int()
    lendingrate = fields.Float()
    sp = fields.Float()
    horizon = fields.Int()


class UserStressScenarioSchema(Schema):
    """
        StressScenario schema
    """
    id = fields.Int()
    startDate = fields.Str()
    endDate = fields.Str()
    userId = fields.Int()
    interest = fields.Float()
    rates = fields.Str()
    low = fields.Float()
    high = fields.Float()
    annuity = fields.Float()
    totalAddition = fields.Float()
