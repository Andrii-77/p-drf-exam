import os

from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template

from configs.celery import app
from core.services.jwt_service import ActivateToken, JWTService, RecoveryToken


class EmailService:
    @staticmethod
    @app.task
    def __send_email(to, template_name: str, context: dict, subject: str) -> None:
        template = get_template(template_name)
        html_content = template.render(context)

        # Перевіряємо, чи to вже список
        if isinstance(to, str):
            to_list = [to]
        else:
            to_list = to  # якщо вже список, передаємо як є

        msg = EmailMultiAlternatives(
            to=to_list,
            from_email=os.environ.get('EMAIL_HOST_USER'),
            subject=subject,
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()

    # def __send_email(to: str, template_name: str, context: dict, subject: str) -> None:
    #     template = get_template(template_name)
    #     html_content = template.render(context)
    #     msg = EmailMultiAlternatives(
    #         to=[to],
    #         from_email=os.environ.get('EMAIL_HOST_USER'),
    #         subject=subject,
    #     )
    #     msg.attach_alternative(html_content, "text/html")
    #     msg.send()

    @classmethod
    def register(cls, user):
        token = JWTService.create_token(user, ActivateToken)
        url = f'http://localhost/activate/{token}'
        cls.__send_email.delay(
            to=user.email,
            template_name='register.html',
            context={'name': user.profile.name, 'url': url},
            subject="Register"
        )

    @classmethod
    def recovery(cls, user):
        token = JWTService.create_token(user, RecoveryToken)
        url = f'http://localhost/auth/recovery/{token}'
        cls.__send_email(
            to=user.email,
            template_name='recovery.html',
            context={'url': url},
            subject="Recovery"
        )
        
    @classmethod
    def manager_email_for_car_poster_edit(cls, car):
       cls.__send_email(
           to='bimber@i.ua', #тут мають бути пошти менеджерів
           template_name='for_car_poster_edit.html',
           context={'id': car.id },
           subject='Оголошення потребує ручної модерації'
       )

    @classmethod
    def support_request(cls, instance):
        cls.__send_email(
            to=["admin@gmail.com", "bimber@i.ua"], # type: ignore  # список email менеджерів/адмінів
            template_name="support_request.html",
            context={
                "type": instance.type,
                "text": instance.text,
                "brand": instance.car_brand.brand if instance.car_brand else None,
                "user": instance.user.email if instance.user else "Anonymous",
            },
            subject="Нова заявка підтримки",
        )