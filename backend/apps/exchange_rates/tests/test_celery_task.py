from unittest.mock import MagicMock, patch

from django.test import TestCase


class UpdateRatesCeleryTaskTests(TestCase):

    @patch("core.tasks.update_exchange_rates_task.delay")
    def test_task_calls_command(self, mock_delay: MagicMock):
        """
        Перевіряємо, що таска celery викликає delay()
        """
        # Імпорт робимо всередині, щоб патч уже працював
        from core.tasks import update_exchange_rates_task

        update_exchange_rates_task.delay()

        mock_delay.assert_called_once()