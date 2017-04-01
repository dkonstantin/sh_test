PROJECT_NAME = "ServerHubTest"
DB_NAME = "db.sqlite3"

ENV_PYTHON = venv/bin/python -W ignore::DeprecationWarning -W ignore::RuntimeWarning
ENV_PIP = venv/bin/pip

default: virtualenv requirements db end

virtualenv:
	virtualenv venv

requirements:
	$(ENV_PIP) install -r requirements.txt

db: dropdb migrate

dropdb:
	@echo "Destroying database $(DB_NAME)"
	@make -i _dropdb >> /dev/null

_dropdb:
	if [ -f "$(DB_NAME)" ]; then rm $(DB_NAME); fi

migrate:
	@echo "Running migrations"
	$(ENV_PYTHON) manage.py migrate

run: clean
	$(ENV_PYTHON) manage.py runserver

runpub:
	$(ENV_PYTHON) manage.py runserver 0.0.0.0:8000

end:
	@echo "You can now run development server using 'make run' command"

clean:
	@echo "Cleaning *.pyc files"
	@find . -name "*.pyc" -exec rm -f {} \;

createsuperuser:
	$(ENV_PYTHON) manage.py createsuperuser