"""
This file contains a script which uploads a JSONL file to Together AI for fine tuning.
Documentation can be found on: https://docs.together.ai/docs/fine-tuning-python.
"""

import together
import os
from dotenv import load_dotenv
load_dotenv()

# Global Configuration Variables.
together.api_key = os.getenv("TOGETHER_AI_KEY")
JSONL_FILE = os.getenv("JSONL_FILE")
MODEL = os.getenv("BASE_MODEL")
OUTPUT_FILE = os.getenv("OUTPUT_FILE")

try:
    # Upload the jsonl file.
    upload_resp = together.Files.upload(file=JSONL_FILE)

    # If id is not in the response, the upload has failed.
    # Raise an exception with the error information.
    if "id" not in upload_resp:
        raise Exception(upload_resp)
    
    # Otherwise, extract the id and start the fine-tuning process.
    file_id = upload_resp["id"]
    fine_tuning_resp = together.Finetune.create(
        training_file = file_id,
        model = MODEL,
        n_epochs = 3,
        n_checkpoints = 1,
        batch_size = 4,
        learning_rate = 1e-5,
        suffix = "atlasAI-finetune"
    )

    with open(OUTPUT_FILE, "w") as output_file:
        output_file.write(fine_tuning_resp)

    
except Exception as e:
    print(e)