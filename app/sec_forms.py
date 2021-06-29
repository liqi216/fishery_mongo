from flask_appbuilder.security.forms import RegisterUserDBForm
from flask_appbuilder.fieldwidgets import BS3PasswordFieldWidget, BS3TextFieldWidget
from flask_appbuilder.forms import DynamicForm
from flask_babel import lazy_gettext
from wtforms import StringField, BooleanField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, ValidationError, EqualTo
from flask_wtf import FlaskForm

class MyRegisterUserDBForm(RegisterUserDBForm):
    affiliation = StringField(lazy_gettext('Affiliation'),
                                widget=BS3TextFieldWidget(),
                                description=lazy_gettext('Please enter your affiliation'))

class RequestResetForm(DynamicForm):
    email = StringField(lazy_gettext('Email'), validators=[DataRequired(), Email()], widget=BS3TextFieldWidget())
