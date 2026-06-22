import json
import os
from openai import OpenAI
from api.blueprint import api
from api.blueprint import api
from flask import request, jsonify
from api.models import db, User, Product, Order, OrderItem, SubscriptionPlan, Subscription, Payment, Cart, CartItem, MyPlan, DietExerciseType, PaymentStatus
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from sqlalchemy import select

def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise ValueError("OPENAI_API_KEY is missing")

    return OpenAI(api_key=api_key)


# PROMPTS
def build_workout_prompt(data):
    return f"""
Eres un entrenador personal experto. Crea un plan de entrenamiento personalizado
de 12 semanas basado en los siguientes datos del usuario:
 
DATOS DEL USUARIO:
- Edad: {data.get('age')} años
- Peso: {data.get('weight')} kg
- Altura: {data.get('height')} cm
- Objetivo: {data.get('goal')}
- Frecuencia disponible: {data.get('days_per_week')} días/semana
- Duración por sesión: {data.get('session_duration')} minutos
- Equipamiento: {data.get('equipment', 'sin equipamiento')}
- Nivel actual: {data.get('fitness_level')}
- Tiempo sin entrenar: {data.get('time_without_training', 'N/A')}
- Lesiones o limitaciones: {data.get('injuries', 'ninguna')}
 
INSTRUCCIONES DE FORMATO:
Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta, sin texto adicional:
 
{{
  "plan_name": "nombre del plan",
  "goal": "objetivo principal",
  "duration_weeks": 12,
  "weekly_structure": {{
    "days_per_week": {data.get('days_per_week')},
    "rest_days": "descripción de días de descanso"
  }},
  "weeks": [
    {{
      "week_range": "Semanas 1-4",
      "phase": "nombre de la fase",
      "focus": "descripción del enfoque",
      "sessions": [
        {{
          "day": "Lunes",
          "type": "tipo de sesión",
          "warmup": "calentamiento (5-10 min)",
          "exercises": [
            {{
              "name": "nombre del ejercicio",
              "sets": 3,
              "reps": "10-12",
              "rest_seconds": 60,
              "notes": "indicaciones técnicas"
            }}
          ],
          "cooldown": "enfriamiento (5 min)"
        }}
      ]
    }}
  ],
  "general_tips": ["consejo 1", "consejo 2"],
  "progression_notes": "cómo progresar a lo largo de las semanas"
}}
"""


def build_diet_prompt(data):
    return f"""
Eres un nutricionista experto. Crea un plan de alimentación personalizado
de 12 semanas basado en los siguientes datos:
 
DATOS DEL USUARIO:
- Edad: {data.get('age')} años
- Peso: {data.get('weight')} kg
- Altura: {data.get('height')} cm
- Objetivo: {data.get('goal')}
- Nivel de actividad física: {data.get('activity_level')}
- Número de comidas al día: {data.get('meals_per_day', 3)}
- Presupuesto: {data.get('budget', 'estándar')}
- Tipo de dieta: {data.get('diet_type', 'omnívora')}
- Alergias o intolerancias: {data.get('allergies', 'ninguna')}
- Alimentos que no le gustan: {data.get('disliked_foods', 'ninguno')}
 
INSTRUCCIONES DE FORMATO:
Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta, sin texto adicional:
 
{{
  "plan_name": "nombre del plan",
  "goal": "objetivo principal",
  "duration_weeks": 12,
  "daily_calories": 2000,
  "macros": {{
    "protein_g": 150,
    "carbs_g": 200,
    "fat_g": 70
  }},
  "weekly_menu": [
    {{
      "week_range": "Semanas 1-4",
      "phase": "nombre de la fase",
      "days": [
        {{
          "day": "Lunes",
          "meals": [
            {{
              "meal_type": "Desayuno",
              "time": "08:00",
              "foods": [
                {{
                  "name": "nombre del alimento",
                  "quantity": "100g",
                  "calories": 200,
                  "notes": "preparación o tips"
                }}
              ],
              "total_calories": 400
            }}
          ]
        }}
      ]
    }}
  ],
  "hydration": "recomendación de hidratación",
  "supplements": ["suplemento opcional 1"],
  "general_tips": ["consejo 1", "consejo 2"]
}}
"""


def call_ia(prompt):
    client = get_openai_client()
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": """
                Eres un experto en nutrición y entrenamiento.
                Devuelve únicamente JSON válido.
                """
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = response.choices[0].message.content

    print(content)  # debug

    return json.loads(content)


@api.route('/myplans/generate', methods=['POST'])
@jwt_required()
def generate_myplan():

    user_id = int(get_jwt_identity())
    body = request.get_json()

    if not body.get('tipo_plan'):
        return jsonify({
            "success": False,
            "msg": "tipo_plan es obligatorio"
        }), 400

    try:
        tipo = DietExerciseType(body['tipo_plan'])
    except ValueError:
        return jsonify({
            "success": False,
            "msg": "tipo_plan debe ser 'diet' o 'workout'"
        }), 400

    plan_id = body.get('plan_id', 1)

    prompt = (
        build_workout_prompt(body)
        if tipo == DietExerciseType.workout
        else build_diet_prompt(body)
    )

    try:
        plan_data = call_ia(prompt)

    except Exception as e:
        return jsonify({
            "success": False,
            "msg": f"Error con OpenAI: {str(e)}"
        }), 500

    new_plan = MyPlan(
        user_id=user_id,
        plan_id=plan_id,
        tipo_plan=tipo,
        plan_data=plan_data
    )

    db.session.add(new_plan)
    db.session.commit()

    return jsonify({
        "success": True,
        "data": new_plan.serialize()
    }), 201



# GET ALL MY PLANS


@api.route('/myplans', methods=['GET'])
def get_myplans():
    plans = db.session.execute(select(MyPlan)).scalars().all()
    transform = [plan.serialize() for plan in plans]
    return jsonify({"success": True, "data": transform}), 200

# GET ONE PLAN BY USER


@api.route('/myplans/<int:user_id>', methods=['GET'])
def get_user_myplans(user_id):
    # execute() porque buscamos por user_id que NO es la primary key
    plans = db.session.execute(select(MyPlan).where(
        MyPlan.user_id == user_id)).scalars().all()
    transform = [plan.serialize() for plan in plans]
    return jsonify({"success": True, "data": transform}), 200

# CREATE PLAN

@api.route('/myplans', methods=['POST'])
@jwt_required()
def create_myplan():
    user_id = get_jwt_identity()
    body = request.get_json()

    if not body.get('plan_id'):
        return jsonify({"sucess": True, "msg": "missing data"}), 403
    # Lo convertimos al enum
    # llega "diet" desde el frontend
    try:
        tipo = DietExerciseType(body['tipo_plan'])
    except ValueError:
        return jsonify({"success": False, "msg": "tipo_plan must be'diet'or 'workout'"}), 400
 # Ahora sí se lo pasamos al modelo como enum
    new_myplan = MyPlan(
        user_id=user_id,
        plan_id=body['plan_id'],
        tipo_plan=tipo,
        plan_data=body.get('plan_data')
    )

    db.session.add(new_myplan)

    db.session.commit()

    return jsonify({"success": True, "data": new_myplan.serialize()}), 200
