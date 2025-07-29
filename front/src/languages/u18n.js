import i18next from "i18next";
import {initReactI18next} from 'react-i18next';
import languagedetector from "i18next-browser-languagedetector";

i18next
    .use(initReactI18next)
    .use(languagedetector)
    .init(
        {
            fallbackLng: 'en',
            resources: {
                en: {
                    translation: {
                        'Title-ticket': 'Title'
                    }
                },
                ru : {
                    translation: {
                        'Log in to your account': 'Войти в аккаунт',
                        'Your email': 'Почта',
                        'Your password': 'Пароль',
                        'Forgot password?': 'Забыли пароль?',
                        'Log in': 'Войти',
                        'Don\'t have an account?': 'Нету аккаунта?',
                        'Sign Up': 'Зарегистрироваться',
                        'Create an account': 'Создание аккаунта',
                        'Repeat your password': "Повторите пароль",
                        'Use at least 8 characters.': "Используйте минимум 8 символов",
                        'Your Name': "Ваше имя",
                        "Your Last Name": "Ваша фамилия",
                        'Register account': 'Создать аккаунт',
                        'Already have an account?': "Уже имеете аккаунт?",
                        'Home': 'Главная',
                        'Tickets Administration': "Управление запросами",
                        'User Administration': "Менеджер пользователей",
                        "Account settings": "Настройки аккаунта",
                        "Log out": "Выйти с аккаунта",
                        "All": "Все",
                        "Open": "Открытые",
                        "In Progress": "В процессе",
                        "Closed": "Закрытые",
                        "Page": "Страница",

                        "Your tickets": "Ваши запросы",
                        "Create ticket": "Создать запрос",
                        "Title": "Название",
                        "Status": "Статус",

                        "Tickets manager": "Управление запросами",
                        "Opened": "Открытые",
                        "Delete": "Удалить",

                        "Subject": "Название запроса",

                        "Message": "Подробное описание",
                        "Create": "Создать",

                        "User administration": "Администрирование пользователей",
                        "Name": "Имя",
                        "Last Name": "Фамилия",
                        "Email": "Почта",
                        "Role": "Роль",

                        "User": "Пользователь",
                        "Agent": "Агент",

                        "Settings": "Настройки",
                        "Profile details": "Настройки профиля",
                        "Account Settings": "Настройки аккаунта",
                        "Save changes": "Сохранить изменения",
                        "Delete account": "Удалить аккаунт",

                        "Title-ticket": "Название",
                        "Ticket Information": "Информация о запросе",

                        "Ticket Details": "Информация о запросе",
                        "Assigned agent": "Привязанные агенты",
                        "Created": "Время создания",
                        "Description": "Описание",
                        "Attachements": "Приложенные файлы",
                        "Send message": "Отправить сообщение",
                        "Change password": "Изменить пароль",

                        "Subscribe":  "Взять запрос",
                        "Unsubscribe":  "Отложить запрос",
                        "Language": "Язык",
                        "Are you sure you want to logout?": "Вы уверены что хотите выйти из аккаунта?",
                        "Are you sure you want to delete your account": "Вы уверены что хотите удалить текущий аккаунт?",
                        "Yes": "Да",
                        "No": "Нет",

                    }
                }

            }

        })