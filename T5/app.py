from flask import Flask, render_template, jsonify, request, session
import mysql.connector
import bcrypt

app = Flask(__name__)
app.secret_key = "montana-secret-key"

# ────────────────────────────────────────
# DATABASETILKOBLING
# ────────────────────────────────────────

def get_db():
    return mysql.connector.connect(
        host="10.2.3.157",
        port=3306,
        user="senad",
        password="12345",
        database="MONTANA"
    )

# ────────────────────────────────────────
# FORSIDE
# ────────────────────────────────────────

@app.route("/")
def home():
    con = get_db()
    cur = con.cursor(dictionary=True)
    cur.execute("SELECT * FROM products")
    products = cur.fetchall()

    user = None
    if "user_id" in session:
        cur.execute("SELECT name FROM users WHERE id = %s", (session["user_id"],))
        user = cur.fetchone()

    con.close()
    return render_template("index.html", products=products, user=user)

# ────────────────────────────────────────
# REGISTRERING
# ────────────────────────────────────────

@app.route("/api/register", methods=["POST"])
def register():
    data     = request.get_json()
    name     = data["name"]
    email    = data["email"]
    password = data["password"]

    if not name or not email or not password:
        return jsonify({"ok": False, "error": "Fill in all fields."})

    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    ip = request.remote_addr

    try:
        con = get_db()
        cur = con.cursor()
        cur.execute(
            "INSERT INTO users (name, email, password, active, ip_address) VALUES (%s, %s, %s, 'enabled', %s)",
            (name, email, hashed_password, ip)
        )
        con.commit()
        session["user_id"] = cur.lastrowid
        con.close()
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})

    return jsonify({"ok": True})

# ────────────────────────────────────────
# INNLOGGING
# ────────────────────────────────────────

@app.route("/api/login", methods=["POST"])
def login():
    data     = request.get_json()
    email    = data["email"]
    password = data["password"]

    try:
        con = get_db()
        cur = con.cursor(dictionary=True)
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        con.close()

        if not user:
            return jsonify({"ok": False, "error": "No account with that email."})

        if not bcrypt.checkpw(password.encode(), user["password"].encode()):
            return jsonify({"ok": False, "error": "Wrong password."})

        if user.get("active") == "disabled":
            return jsonify({"ok": False, "error": "This account has been disabled."})

        session["user_id"] = user["id"]
        return jsonify({"ok": True})

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})

# ────────────────────────────────────────
# UTLOGGING
# ────────────────────────────────────────

@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"ok": True})




# ────────────────────────────────────────
# CHECKOUT
# ────────────────────────────────────────

@app.route("/api/checkout", methods=["POST"])
def checkout():
    if "user_id" not in session:
        return jsonify({"ok": False, "error": "You must be logged in."})

    items = request.get_json()["items"]
    total = sum(item["price"] * item["qty"] for item in items)

    con = get_db()
    cur = con.cursor()

    cur.execute(
        "INSERT INTO orders (user_id, total) VALUES (%s, %s)",
        (session["user_id"], total)
    )
    order_id = cur.lastrowid

    for item in items:
        cur.execute(
            "INSERT INTO order_items (order_id, product_id, product_name, price, qty) VALUES (%s, %s, %s, %s, %s)",
            (order_id, item["id"], item["name"], item["price"], item["qty"])
        )

    con.commit()
    con.close()
    return jsonify({"ok": True, "order_id": order_id})




    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)