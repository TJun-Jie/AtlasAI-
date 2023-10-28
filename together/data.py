import json
from samples import SAMPLES


def clean_data(samples: list):
    res = []
    for sample in samples:
        pass


def save_data(data, path="data.jsonl"):
    with open(path, "w") as f:
        json.dump(data, f)


def main():
    data = clean_data(SAMPLES)
    save_data(data)
