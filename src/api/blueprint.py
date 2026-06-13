from flask import Blueprint # type: ignore

api = Blueprint('api', __name__)


from api.api_routes.subscription_plans import *
from api.api_routes.payment import *
from api.api_routes.payments import *
from api.api_routes.products import *
from api.api_routes.carts import *
from api.api_routes.orders import *
from api.api_routes.subscription import *
from api.api_routes.users import *