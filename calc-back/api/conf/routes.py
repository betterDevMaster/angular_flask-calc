#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask_restful import Api
# from flask-restful import Api
# from flask_cors import cross_origin
from api.handlers.UserHandlers import (Welcome, AddUser, DataAdminRequired, DataUserRequired, Login, Register, ResendEmail,
                                       ForgotPassword, ResetPassword, ConfirmEmail, Logout, RefreshToken, ResetPassword, UsersData, UsersAllData, UserData, UserUpdate)

from api.handlers.LanguageHandlers import (LanguagesAllData, LanguageData, LanguagePageData,
                                           LanguageTitle, LanguageDelete, LanguageStatus, LanguageComponentData, LanguageComponentDataAll)

from api.handlers.CountryHandlers import (
    CountriesAllData, CountryData, CountryDelete)

from api.handlers.ContentHandlers import (
    ContentNameAll, ContentMains, ContentSurcharges, ContentReductions, ContentRanges, ContentGuarantors, ContentVariety)

from api.handlers.IndividualHandlers import (CalcCheckTbl, IndividualBasis, IndividualIndividual, IndividualIndividualSave, IndividualLocalSave, IndividualSpecial, IndividualSpecialCalc, IndividualHouseholdCalc, IndividualHousehold,
                                             IndividualLivingspaceCalc, IndividualLivingspace, IndividualProjectcostCalc, IndividualProjectcostTurnkey, IndividualProjectcost, IndividualFileupload, IndividualFileDownload, IndividualFiledelete, IndividualDocuments, StressScenario, UserStressScenario, stressScenarioDelete)


def generate_routes(app):

    # Create api.
    api = Api(app)

    # Add all routes resources.
    # Register page.
    # api.add_resource(Register, '/v1/auth/register')
    # Welcome page
    api.add_resource(Welcome, '/')
    # Login page.
    api.add_resource(Login, '/v1/auth/login')
    # Register page.
    api.add_resource(Register, '/v1/auth/register')
    # Resend email.
    api.add_resource(ResendEmail, '/v1/auth/resend')
    # Forgot password.
    api.add_resource(ForgotPassword, '/v1/auth/forgot')
    # Reset password.
    api.add_resource(ResetPassword, '/v1/auth/reset')
    # Reset password.
    api.add_resource(ConfirmEmail, '/v1/auth/confirm')
    # Logout page.
    api.add_resource(Logout, '/v1/auth/logout')

    # Refresh page.
    api.add_resource(RefreshToken, '/v1/auth/refresh')

    # # Password reset page. Not forgot.
    # api.add_resource(ResetPassword, '/v1/auth/password_reset')

    # Get all users with admin permissions.
    api.add_resource(UsersAllData, '/v1/members/admin')

    # Get a user info with admin permissions.
    api.add_resource(UserData, '/v1/member/admin')

    # Get a user info with admin permissions.
    api.add_resource(UserUpdate, '/v1/member/Update', methods=['PUT'])

    # Get users page with admin permissions.
    api.add_resource(UsersData, '/users')

    # Example admin handler for admin permission.
    api.add_resource(DataAdminRequired, '/data_admin')

    # Example user handler for user permission.
    api.add_resource(DataUserRequired, '/data_user')

    # Example user handler for user permission.
    api.add_resource(AddUser, '/user_add')

    # Get all languages
    api.add_resource(LanguagesAllData, '/v1/langs/admin')
    # Get all language Details
    api.add_resource(LanguageData, '/v1/lang/admin')
    # Get page language Details
    api.add_resource(LanguagePageData, '/v1/langPage/admin')
    # Get language title
    api.add_resource(LanguageTitle, '/v1/langTitle/admin')
    # Delete language
    api.add_resource(LanguageDelete, '/v1/langDelete/admin')
    # Active language
    api.add_resource(LanguageStatus, '/v1/langActive/admin')
    # Save language components
    api.add_resource(LanguageComponentData, '/v1/langComponent/admin')
    api.add_resource(LanguageComponentDataAll, '/v1/langComponentAll/admin')

    # Get all countries
    api.add_resource(CountriesAllData, '/v1/countries/admin')
    # Get country
    api.add_resource(CountryData, '/v1/country/admin')
    # Delete country
    api.add_resource(CountryDelete, '/v1/countryDelete/admin')

    # Contents
    api.add_resource(ContentNameAll, '/v1/names/content')
    api.add_resource(ContentMains, '/v1/mains/content')
    api.add_resource(ContentSurcharges, '/v1/surcharges/content')
    api.add_resource(ContentReductions, '/v1/reductions/content')
    api.add_resource(ContentRanges, '/v1/ranges/content')
    api.add_resource(ContentGuarantors, '/v1/guarantors/content')
    # Individual
    api.add_resource(ContentVariety, '/v1/names/page')
    api.add_resource(IndividualBasis, '/v1/basis/individual')
    api.add_resource(IndividualIndividual, '/v1/individual/individual')
    api.add_resource(IndividualIndividualSave, '/v1/individualSave/individual')
    api.add_resource(IndividualLocalSave, '/v1/individualLocalSave/individual')
    api.add_resource(CalcCheckTbl, '/v1/isDB/individual')
    api.add_resource(IndividualSpecial, '/v1/special/individual')
    api.add_resource(IndividualSpecialCalc, '/v1/specialCalc/individual')
    api.add_resource(IndividualHouseholdCalc, '/v1/householdCalc/individual')
    api.add_resource(IndividualHousehold, '/v1/household/individual')
    api.add_resource(IndividualLivingspaceCalc,
                     '/v1/livingspaceCalc/individual')
    api.add_resource(IndividualLivingspace, '/v1/livingspace/individual')
    api.add_resource(IndividualProjectcostCalc,
                     '/v1/projectcostCalc/individual')
    api.add_resource(IndividualProjectcostTurnkey,
                     '/v1/projectcostCalcTurnkey/individual')
    api.add_resource(IndividualProjectcost, '/v1/projectcost/individual')
    api.add_resource(IndividualFileupload, '/v1/fileUpload/individual')
    api.add_resource(IndividualFiledelete, '/v1/fileDelete/individual')
    api.add_resource(IndividualDocuments, '/v1/documents/individual')
    api.add_resource(StressScenario,
                     '/v1/individual/individual/stressScenario')
    api.add_resource(UserStressScenario,
                     '/v1/individual/individual/userStressScenario')
    api.add_resource(stressScenarioDelete,
                     '/v1/individual/individual/stressScenarioDelete')
    # api.add_resource(IndividualFileDownload, '/uploads')
