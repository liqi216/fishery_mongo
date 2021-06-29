from flask_appbuilder.security.registerviews import BaseRegisterUser
from flask_appbuilder._compat import as_unicode
from flask_appbuilder.security.views import UserDBModelView, AuthDBView
from flask_appbuilder.fieldwidgets import BS3PasswordFieldWidget, BS3TextFieldWidget
from flask_appbuilder.views import expose, PublicFormView
from flask_appbuilder.baseviews import BaseFormView
from flask_appbuilder.security.forms import ResetPasswordForm
from flask_appbuilder import const as c
from flask_babel import lazy_gettext
from flask import flash, redirect, session, url_for, request,g, render_template, Flask
from wtforms import StringField, BooleanField, PasswordField, validators, PasswordField
from wtforms.validators import EqualTo
from flask_login import current_user
from app.sec_forms import MyRegisterUserDBForm, RequestResetForm
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
import logging


log = logging.getLogger(__name__)


class MyAuthDBView(AuthDBView):
    login_template = 'login.html'


class MyUserDBModelView(UserDBModelView):
    add_form_extra_fields = {'affiliation': StringField(lazy_gettext('Affiliation'), description=lazy_gettext('Please enter your affiliation'), widget =BS3TextFieldWidget()),
                              'password': PasswordField(lazy_gettext('Password'), description=lazy_gettext('Please use a good password policy, this application does not check this for you'), validators=[validators.DataRequired()], widget=BS3PasswordFieldWidget()),
                              'conf_password': PasswordField(lazy_gettext('Confirm Password'), description=lazy_gettext('Please rewrite the user\'s password to confirm'), validators=[EqualTo('password', message=lazy_gettext('Passwords must match'))], widget=BS3PasswordFieldWidget())}

    add_columns = ['first_name', 'last_name', 'username', 'active', 'email', 'roles', 'affiliation', 'password', 'conf_password']
    list_columns = ['first_name', 'last_name', 'username', 'email', 'affiliation','active', 'roles']
    edit_columns = ['first_name', 'last_name', 'username', 'active', 'email', 'roles', 'affiliation']


"""
    View for registration process
"""
class MyRegisterUserDBView(BaseRegisterUser):
    form = MyRegisterUserDBForm
    redirect_url = '/'

    def add_registration(self, username, first_name, last_name, email, affiliation, password=''):

        register_user = self.appbuilder.sm.add_register_user(username, first_name, last_name, email, affiliation, password)
        if register_user:
            if self.send_email(register_user):
                flash(as_unicode(self.message), 'info')
                return register_user
            else:
                flash(as_unicode(self.error_message), 'danger')
                self.appbuilder.sm.del_register_user(register_user)
                return None

    def form_get(self, form):
        self.add_form_unique_validations(form)

    def form_post(self, form):
        self.add_form_unique_validations(form)
        self.add_registration(username=form.username.data,
                                          first_name=form.first_name.data,
                                          last_name=form.last_name.data,
                                          email=form.email.data,
                                          affiliation=form.affiliation.data,
                                          password=form.password.data)


    @expose('/activation/<string:activation_hash>')
    def activation(self, activation_hash):
        """
            Endpoint to expose an activation url, this url
            is sent to the user by email, when accessed the user is inserted
            and activated
        """
        reg = self.appbuilder.sm.find_register_user(activation_hash)
        if not reg:
            log.error(c.LOGMSG_ERR_SEC_NO_REGISTER_HASH.format(activation_hash))
            flash(as_unicode(self.false_error_message), 'danger')
            return redirect(self.appbuilder.get_url_for_index)
        if not self.appbuilder.sm.add_user(username=reg.username,
                                               email=reg.email,
                                               first_name=reg.first_name,
                                               last_name=reg.last_name,
                                               affiliation=reg.affiliation,
                                               role=self.appbuilder.sm.find_role(
                                                       self.appbuilder.sm.auth_user_registration_role),
                                               hashed_password=reg.password):
            flash(as_unicode(self.error_message), 'danger')
            return redirect(self.appbuilder.get_url_for_index)
        else:
            self.appbuilder.sm.del_register_user(reg)
            return self.render_template(self.activation_template,
                               username=reg.username,
                               first_name=reg.first_name,
                               last_name=reg.last_name,
                               affiliation=reg.affiliation,
                               appbuilder=self.appbuilder)


class ResetRequestView(PublicFormView):
    """
        View for entering email for reset request
    """
    route_base = '/resetrequest'
    form = RequestResetForm
    form_template= 'requestResetForm.html'
    form_title = lazy_gettext('Request Reset')
    redirect_url = '/'
    message = lazy_gettext('An email will be sent with the reset link')
    error_message = lazy_gettext('Unabe to sent reset email, please try again later.')
    invalid_email_message = lazy_gettext('Email not found in system. Please try again.')
    email_subject = lazy_gettext('Reset Password')
    email_template = 'reset_email.html'
    expires_sec = 900

    def form_get(self,form):
        if form.validate_on_submit():
            #check that user email exists in system
            user = self.appbuilder.sm.find_user_for_reset(form.email.data)
            if not user:
                flash(as_unicode(self.invalid_email_message), 'warning')
                return redirect(url_for('ResetRequestView.this_form_get'))

    def form_post(self,form):
        if form.validate_on_submit():
            #check that user email exists in system
            user = self.appbuilder.sm.find_user_for_reset(form.email.data)
            if not user:
                flash(as_unicode(self.invalid_email_message), 'warning')
                return redirect(url_for('ResetRequestView.this_form_get'))
            if self.send_email(user):
                flash(as_unicode(self.message), 'info')
                return redirect(self.appbuilder.get_url_for_index)
            else:
                flash(as_unicode(self.error_message), 'danger')
                return redirect(self.appbuilder.get_url_for_index)

    def get_reset_token(self,user,expires_sec):
        s = Serializer(self.appbuilder.get_app.config['SECRET_KEY'], expires_sec)
        user_id = str(user.id)
        return s.dumps({'user_id' : user_id}).decode('utf-8')



    def send_email(self, user):
        """
            Method for sending reset link to user
        """
        try:
            from flask_mail import Mail, Message
        except:
            log.error("Install Flask-Mail to use User registration")
            return False
        token = self.get_reset_token(user, self.expires_sec)
        mail = Mail(self.appbuilder.get_app)
        msg = Message()
        msg.subject = self.email_subject
        expires_min = self.expires_sec//60
        url = url_for('ResetPasswordFromRequestView.this_form_get', _external=True, token=token)
        msg.html = self.render_template(self.email_template,
                                   url=url,
                                   username=user.username,
                                   first_name=user.first_name,
                                   last_name=user.last_name,
                                   link_expire= expires_min)
        msg.recipients = [user.email]
        try:
            mail.send(msg)
        except Exception as e:
            log.error("Send email exception: {0}".format(str(e)))
            return False
        return True

class ResetPasswordFromRequestView(BaseFormView):
    """
        View for acceccing reset link and inputing new password
    """
    route_base = '/reset'
    form_title = lazy_gettext('Reset Password')
    form = ResetPasswordForm
    form_template = 'resetForm.html'
    redirect_url = '/'
    error_message = lazy_gettext('That is an invalid or expired token')
    message =lazy_gettext('Password has been changed')
    danger_message = lazy_gettext('Could not find user.')

    def verify_reset_token(self,token):
        s = Serializer(self.appbuilder.get_app.config['SECRET_KEY'])
        try:
            user_id = s.loads(token)['user_id']
        except:
            return None
        return user_id

    @expose('/resetpassword/<string:token>', methods=['GET'])
    def this_form_get(self, token):
        #check that token is still valid and has not expired
        user_id = self.verify_reset_token(token);
        if user_id is None:
            flash(self.error_message, 'warning')
            return redirect(self.appbuilder.get_url_for_index)
        user = self.appbuilder.sm.get_user_by_id(user_id)
        if user is None:
            flash(self.danger_message, 'danger')
            return redirect(self.appbuilder.get_url_for_index)
        self._init_vars()
        form = self.form.refresh()
        #self.form_get(form)
        widgets = self._get_edit_widget(form=form)
        self.update_redirect()
        return self.render_template(self.form_template,
                                    title=self.form_title,
                                    widgets=widgets,
                                    appbuilder=self.appbuilder
        )

    @expose('/resetpassword/<string:token>', methods=['POST'])
    def this_form_post(self, token):
        self._init_vars()
        form = self.form.refresh()
        #check that token is still valid and has not expired
        user_id = self.verify_reset_token(token);
        if user_id is None:
            flash(self.error_message, 'warning')
            return redirect(self.appbuilder.get_url_for_index)
        user = self.appbuilder.sm.get_user_by_id(user_id)
        if user is None:
            flash(self.danger_message, 'danger')
            return redirect(self.appbuilder.get_url_for_index)
        #reset user password
        if form.validate_on_submit():
            self.appbuilder.sm.reset_password(user.id, form.password.data)
            flash(as_unicode(self.message), 'info')
            return redirect(self.appbuilder.get_url_for_index)
        else:
            widgets = self._get_edit_widget(form=form)
            return self.render_template(
                self.form_template,
                title=self.form_title,
                widgets=widgets,
                appbuilder=self.appbuilder
            )
