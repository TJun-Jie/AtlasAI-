import json
import re

from samples import SAMPLES

PROMPT_PREFIX = """Generate a new schedule that contains a list of event objects,
                based on the following tasks and stress scores.
                If the current schedule makes sense, you do not need to change it.
                If there is a difference between the new schedule and the old schedule, 
                add a new reason field to each rescheduled task and describe the reason for the change.\n"""


def clean_data(samples: list):
    res = []
    for sample in samples:
        text = parse_sample(sample)
        res.append({"text": text})
    while len(res) < 100:
        # res.append({"text": parse_sample({})})
        res.append({"text": ""})
    return res


def parse_sample(sample: dict):
    text = "<s> [INST] "
    if sample.get("system", None):
        text += f"<<SYS>> {sample['system']} <</SYS>> "
    text += f"{PROMPT_PREFIX} {sample.get('prompt', '')} [/INST] "
    text += f"{sample.get('output', '')} </s>"
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
