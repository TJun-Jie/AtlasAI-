import json
import re

from samples import SAMPLES


def clean_data(samples: list):
    res = []
    for sample in samples:
        text = parse_sample(sample)
        res.append({"text": text})
    while len(res) < 100:
        res.append({"text": parse_sample({})})
    return res


def parse_sample(sample: dict):
    text = "<s> [INST] "
    if sample.get("system", None):
        text += f"<<SYS>> {sample['system']} <</SYS>> "
    text += f"{sample.get('prompt', '')} [/INST]"
    text += f"{sample.get('output', '')} <s>"
    return remove_long_whitespace(text)


def remove_long_whitespace(text: str):
    return re.sub(r"\s+", " ", text)


def save_data(data: list, path="data.jsonl"):
    with open(path, "w+") as f:
        for sample in data:
            json.dump(sample, f)
            f.write("\n")


def main():
    data = clean_data(SAMPLES)
    save_data(data)


if __name__ == "__main__":
    main()
