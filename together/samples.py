SAMPLES = [
    {
        "system": """You are a personal assistant that helps me schedule my day's tasks.
                    You are given two arrays: tasks and stressScores.
                    Each object in tasks has the following fields: {
                        startTime: in ISO 8601 format,
                        deadline: NULL if no deadline,
                        isFixed: boolean,
                        duration: in minutes,
                        priority: 1 (low), 2 (medium), 3 (high)
                    }
                    Each object in stressScores has the following fields: {
                        hour: 0-23,
                        score: 0-100
                    }
                    Given my stress score for each hour of the day, schedule tasks during my least stressful hours.
                    Schedule high prority tasks first, overwriting stress levels.
                    You can reorder flexible tasks, but fixed tasks cannot be changed.
                    Respect the duration of the tasks. If I have a 30 minute task, do not schedule it for 15 minutes.
                    Do not schedule any tasks such that its startTime falls between 22:00 and 08:00.
                    """,
        "prompt": """tasks: [
            {
                startTime: "2023-11-13T17:00:00",
                deadline: "2023-11-18T12:00:00",
                isFixed: false,
                title: "Math Problem Set 1",
                duration: 240,  
                priority: 1
            }, 
            {
                startTime: "2023-11-13T09:00:00",
                deadline: NULL,
                isFixed: true,
                title: "Basketball Training",
                duration: 120, 
                priority: 2  
            },
            {
                startTime: "2023-11-13T14:00:00",
                deadline: NULL,
                isFixed: true,
                title: "Coding class",
                duration: 60, 
                priority: 1 
            },
            {
                startTime: "2023-11-13T13:30:00",
                deadline: NULL,
                isFixed: false,
                title: "Team Standup",
                duration: 120,
                priority: 2
            }]
            stressScores: [
            { hour: 0, score: 100 },
            { hour: 1, score: 100 },
            { hour: 2, score: 100 },
            { hour: 3, score: 100 },
            { hour: 4, score: 100 },
            { hour: 5, score: 100 },
            { hour: 6, score: 100 },
            { hour: 7, score: 100 },
            { hour: 8, score: 100 },
            { hour: 9, score: 100 },
            { hour: 10, score: 60 },
            { hour: 11, score: 90 },
            { hour: 12, score: 90 },
            { hour: 13, score: 90 },
            { hour: 14, score: 70 },
            { hour: 15, score: 70 },
            { hour: 16, score: 80 },
            { hour: 17, score: 80 },
            { hour: 18, score: 50 },
            { hour: 19, score: 50 },
            { hour: 20, score: 50 },
            { hour: 21, score: 50 },
            { hour: 22, score: 50 },
            { hour: 23, score: 50 },
        ]
        """,
        # Fixed tasks always the same.
        # Higher priorities come first.
        # Find the latest possible time which has the lowest stress level.
        "output": """[
            {
                startTime: "2023-11-13T20:00:00",
                deadline: "2023-11-18T12:00:00",
                isFixed: false,
                title: "Math Problem Set 1",
                duration: 240,  
                priority: 1
            }, 
            {
                startTime: "2023-11-13T09:00:00",
                deadline: NULL,
                isFixed: true,
                title: "Basketball Training",
                duration: 120, 
                priority: 2  
            },
            {
                startTime: "2023-11-13T14:00:00",
                deadline: NULL,
                isFixed: true,
                title: "Coding class",
                duration: 60, 
                priority: 1 
            },
            {
                startTime: "2023-11-13T18:00:00",
                deadline: NULL,
                isFixed: false,
                title: "Team Standup",
                duration: 120,
                priority: 2
            }]""",
    },
    {
        "prompt": """tasks: [
            {
                startTime: "2023-11-13T17:00:00",
                deadline: "2023-11-18T12:00:00",
                isFixed: false,
                title: "Math Problem Set 1",
                duration: 240,  
                priority: 2
            }, 
            {
                startTime: "2023-11-13T09:00:00",
                deadline: NULL,
                isFixed: true,
                title: "Basketball Training",
                duration: 120, 
                priority: 2  
            },
            {
                startTime: "2023-11-13T14:00:00",
                deadline: NULL,
                isFixed: true,
                title: "Coding class",
                duration: 60, 
                priority: 1 
            },
            {
                startTime: "2023-11-13T13:30:00",
                deadline: NULL,
                isFixed: false,
                title: "Team Standup",
                duration: 120,
                priority: 3
            }]
            
            stressScores: [
            { hour: 0, score: 30 },
            { hour: 1, score: 30 },
            { hour: 2, score: 30 },
            { hour: 3, score: 30 },
            { hour: 4, score: 30 },
            { hour: 5, score: 30 },
            { hour: 6, score: 30 },
            { hour: 7, score: 30 },
            { hour: 8, score: 30 },
            { hour: 9, score: 30 },
            { hour: 10, score: 60 },
            { hour: 11, score: 90 },
            { hour: 12, score: 90 },
            { hour: 13, score: 90 },
            { hour: 14, score: 70 },
            { hour: 15, score: 70 },
            { hour: 16, score: 100 },
            { hour: 17, score: 100 },
            { hour: 18, score: 50 },
            { hour: 19, score: 50 },
            { hour: 20, score: 50 },
            { hour: 21, score: 50 },
            { hour: 22, score: 50 },
            { hour: 23, score: 50 },
            ]
        """,
        # Fixed Tasks always the same.
        # Highest priority comes first.
        # If priority is 3, neglect stress levels and place it as early as possible.
        "output": """[
            {
                startTime: "2023-11-13T18:00:00",
                deadline: "2023-11-18T12:00:00",
                isFixed: false,
                title: "Math Problem Set 1",
                duration: 240,  
                priority: 2
            }, 
            {
                startTime: "2023-11-13T09:00:00",
                deadline: NULL,
                isFixed: true,
                title: "Basketball Training",
                duration: 120, 
                priority: 2  
            },
            {
                startTime: "2023-11-13T14:00:00",
                deadline: NULL,
                isFixed: true,
                title: "Coding class",
                duration: 60, 
                priority: 1 
            },
            {
                startTime: "2023-11-13T11:00:00",
                deadline: NULL,
                isFixed: false,
                title: "Team Standup",
                duration: 120,
                priority: 3
            }]""",
    },
    {
        "prompt": """tasks: [
            {
                startTime: "2023-11-13T18:00:00",
                deadline: "2023-11-13T19:00:00",
                isFixed: false,
                title: "Math Problem Set 1",
                duration: 240,  
                priority: 1
            }, 
            {
                startTime: "2023-11-13T09:00:00",
                deadline: NULL,
                isFixed: true,
                title: "Basketball Training",
                duration: 120, 
                priority: 2  
            },
            {
                startTime: "2023-11-13T14:00:00",
                deadline: NULL,
                isFixed: true,
                title: "Coding class",
                duration: 60, 
                priority: 1 
            },
            {
                startTime: "2023-11-13T11:00:00",
                deadline: NULL,
                isFixed: false,
                title: "Team Standup",
                duration: 120,
                priority: 2
            }]
            
            stressScores: [
            { hour: 0, score: 30 },
            { hour: 1, score: 30 },
            { hour: 2, score: 30 },
            { hour: 3, score: 30 },
            { hour: 4, score: 30 },
            { hour: 5, score: 30 },
            { hour: 6, score: 30 },
            { hour: 7, score: 30 },
            { hour: 8, score: 30 },
            { hour: 9, score: 30 },
            { hour: 10, score: 60 },
            { hour: 11, score: 90 },
            { hour: 12, score: 90 },
            { hour: 13, score: 90 },
            { hour: 14, score: 70 },
            { hour: 15, score: 70 },
            { hour: 16, score: 100 },
            { hour: 17, score: 100 },
            { hour: 18, score: 50 },
            { hour: 19, score: 50 },
            { hour: 20, score: 50 },
            { hour: 21, score: 50 },
            { hour: 22, score: 50 },
            { hour: 23, score: 50 },
            ]
        """,
        # Fixed Tasks always the same.
        # Highest priority comes first.
        # Tasks must be completed before deadlines regardless of priority / stress levels.
        "output": """[
            {
                startTime: "2023-11-13T15:00:00",
                deadline: "2023-11-13T19:00:00",
                isFixed: false,
                title: "Math Problem Set 1",
                duration: 240,  
                priority: 1
            }, 
            {
                startTime: "2023-11-13T09:00:00",
                deadline: NULL,
                isFixed: true,
                title: "Basketball Training",
                duration: 120, 
                priority: 2  
            },
            {
                startTime: "2023-11-13T14:00:00",
                deadline: NULL,
                isFixed: true,
                title: "Coding class",
                duration: 60, 
                priority: 1 
            },
            {
                startTime: "2023-11-13T19:00:00",
                deadline: NULL,
                isFixed: false,
                title: "Team Standup",
                duration: 120,
                priority: 2
            }]""",
    },
]

# Deadline event, start before 24 hrs

# conflict between task and stress -> put in least stressful
