# Document Approval

A document workflow application with a Django REST Framework backend and React frontend, developed for healthcare administration at Clearline HMO. This repository preserves multi-stage memo creation, review, referral and approval workflows.

## Implemented scope

- Separate document models for sales, requisitions, staff requests, refunds and payments.
- Department and manager relationships built around a custom Django user model.
- Explicit approval states and transitions using `django-fsm`.
- API endpoints for document creation, memo viewing and role-specific approval actions.
- Approval records associating an action with a memo and the acting user.
- React authentication, document forms and review screens.

## Architecture and decisions

The backend represents the workflow as a finite state machine rather than a single approved flag. Intermediate review stages and referral paths remain visible in the domain model. Sales memos, for example, have line manager, internal control, management and underwriting stages; other document types follow different routes.

Document fields live in their respective models, while memo and approval code provides shared workflow coordination. Django REST Framework serializers and views expose that model to the React client.

The tradeoff is that workflow rules appear in both model transitions and role-specific views. Changes to an approval route need both layers reviewed together. This is an application snapshot with organization-specific configuration, not a generic workflow package or a claim of current production readiness.

## Code map

| Area | Entry point |
| --- | --- |
| Document types and state transitions | [`memo/models.py`](memo/models.py) |
| Creation and approval actions | [`memo/views.py`](memo/views.py) |
| Routes and serialization | [`memo/urls.py`](memo/urls.py), [`memo/serializers.py`](memo/serializers.py) |
| Users and departments | [`users/models.py`](users/models.py) |
| API routing, Swagger and ReDoc | [`core/urls.py`](core/urls.py) |
| React application | [`frontend/src`](frontend/src) |

## Stack

Python, Django 4.1, Django REST Framework, django-fsm, PostgreSQL, JWT authentication, React 18, React Router, Axios and Tailwind CSS. Historical dependency versions are recorded in `requirements.txt` and `frontend/package.json`.

## Local development notes

The backend expects environment-specific database, email and notification configuration. Review `core/settings.py` and supply your own local settings and environment values. Use a disposable development database and synthetic documents.

With configuration in place, the backend commands are:

```sh
python -m venv .venv
# Activate the environment using the command for your shell.
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The root API route exposes Swagger; `/redoc/` exposes ReDoc. Run the frontend separately and point its API client at your local backend:

```sh
cd frontend
npm install
npm start
```

The historical configuration may need adapting to your machine; these commands do not provision its external services.

## Validation and limits

The Django test modules and React test scaffold are not evidence of comprehensive workflow coverage. Before changing approval behavior, verify allowed and rejected transitions, role access, referral editing and approval recording with synthetic data. This documentation does not claim a fully tested application or an available public demo.
