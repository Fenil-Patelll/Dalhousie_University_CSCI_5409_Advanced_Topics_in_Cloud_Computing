from flask import Flask, request, jsonify
import pymysql.cursors

app = Flask(__name__)

# Configure RDS database connection
db_connection = pymysql.connect(
    host='cloud-network-db-instance-1.c72wk9knld32.us-east-1.rds.amazonaws.com',  # Database host
    user='admin',  # Database username
    password='fenilpatel',  # Database password
    database='mydb',  # Database name
    cursorclass=pymysql.cursors.DictCursor  # Cursor class to fetch results as dictionaries
)

@app.route('/store-products', methods=['POST'])
def store_products():
    try:
        data = request.json  # Extract JSON data from the request
        products = data['products']  # Extract 'products' list from the JSON data

        with db_connection.cursor() as cursor:
            for product in products:
                name = product['name']  # Extract product name
                price = product['price']  # Extract product price
                availability = product['availability']  # Extract product availability
                sql = "INSERT INTO products (name, price, availability) VALUES (%s, %s, %s)"  # SQL statement for inserting product into the database
                cursor.execute(sql, (name, price, availability))  # Execute SQL statement with provided values

        db_connection.commit()  # Commit changes to the database

        return jsonify(message='Success.'), 200  # Return a JSON response with a success message
    except Exception as e:
        return jsonify(message=str(e)), 400  # Return a JSON response with the error message

@app.route('/list-products', methods=['GET'])
def list_products():
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT * FROM products"  # SQL statement for retrieving all products
            cursor.execute(sql)  # Execute SQL statement
            products = cursor.fetchall()  # Fetch all products from the database

        return jsonify(products=products), 200  # Return a JSON response with the list of products
    except Exception as e:
        return jsonify(message=str(e)), 400  # Return a JSON response with the error message

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)  # Run the Flask application on specified host and port
