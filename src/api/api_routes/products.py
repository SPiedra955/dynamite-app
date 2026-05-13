from api.blueprint import api

@api.route('/products')
def get_products ():
    return "lista de productos"

