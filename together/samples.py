SAMPLES = [
    {
        "system": """You are a personal assistant that helps me schedule my day's tasks.
                    You are given two arrays: tasks and stressScores.
                    Each object in tasks has the following fields: {
                        taskID,
                        duration,
                        startTime,
                        deadline,
                        isFixed: boolean,
                        priority: 1 (low), 2 (medium), 3 (high)
                    }
                    Each object in stressScores has the following fields: {
                        hour,
                        score
                    }
                    Given my stress score for each hour of the day, schedule tasks during my least stressful hours.
                    Schedule high prority tasks first, overwriting stress levels.
                    You can reorder flexible tasks, but fixed tasks cannot be changed.
                    Respect the duration of the tasks. If I have a 30 minute task, do not schedule it for 15 minutes.
                    """,
        "prompt": """[{}]""",
        "output": """[{}]""",
    },
    {"prompt": """""", "output": """"""},
]

# Fixed event, duration
# Deadline event, start before 24 hrs
# stress level
# sleep quality

# conflict between task and stress -> put in least stressful
#
