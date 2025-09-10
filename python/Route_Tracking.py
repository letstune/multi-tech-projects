import random
import time

# Define routes in the Kumbh Mela
routes = {
    "Route A": {"length_km": 2.5, "capacity": 5000},
    "Route B": {"length_km": 3.0, "capacity": 7000},
    "Route C": {"length_km": 1.8, "capacity": 4000},
    "Route D": {"length_km": 2.2, "capacity": 6000},
}


def simulate_crowd(route_name, current_time):
    """Simulate crowd density based on time of day and randomness"""
    base = random.randint(1000, 4000)
    peak_factor = 1.5 if 10 <= current_time <= 14 else 1.0  # peak hours 10am–2pm
    return int(base * peak_factor)


def predict_congestion(crowd_count, capacity):
    """Predict congestion level"""
    load = crowd_count / capacity
    if load < 0.5:
        return "Low", "🟢 Safe"
    elif load < 0.8:
        return "Medium", "🟡 Caution"
    else:
        return "High", "🔴 Congested"


def run_simulation():
    print("\n🚦 AI-Based Route Tracking & Congestion Prediction\n")
    current_time = random.randint(6, 20)  # simulate current hour (6am–8pm)
    print(f"⏰ Current Hour: {current_time}:00\n")

    for route, info in routes.items():
        crowd = simulate_crowd(route, current_time)
        level, status = predict_congestion(crowd, info["capacity"])
        print(
            f"{route}: Crowd = {crowd} / {info['capacity']} → {status} ({level})")


if __name__ == "__main__":
    while True:
        run_simulation()
        time.sleep(5)  # auto-update every 5 sec
