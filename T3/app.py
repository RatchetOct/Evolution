from flask import Flask, render_template
import mysql.connector

app = Flask(__name__)
app.secret_key = "montana-secret-key"

def get_db():
    return mysql.connector.connect(
        host="10.2.3.157",
        port=3306,
        user="senad",
        password="12345",
        database="MONTANA"
    )

@app.route("/")
def home():
    con = get_db()
    cur = con.cursor(dictionary=True)
    cur.execute("SELECT * FROM products")
    products = cur.fetchall()
    con.close()
    return render_template("index.html", products=products, user=None)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)