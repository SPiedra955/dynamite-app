from flask import Blueprint # type: ignore

api = Blueprint('api', __name__)


from src.api.api_routes.subscription_plans import *
from src.api.api_routes.myplans import *
from src.api.api_routes.payment import *
from src.api.api_routes.payments import *
from src.api.api_routes.products import *
from src.api.api_routes.carts import *
from src.api.api_routes.orders import *
from src.api.api_routes.subscription import *
from src.api.api_routes.users import *