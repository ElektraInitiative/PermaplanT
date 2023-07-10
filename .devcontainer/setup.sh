cp .devcontainer/.env.frontend ./frontend/.env \
&& cp .devcontainer/.env.backend ./backend/.env \
&& pip install pre-commit \
&& pre-commit install
