import boto3
client = boto3.client('logs')

DAYS_TO_KEEP_LOGS = 7

def main(event, context):
    paginator = client.get_paginator("describe_log_groups")
    page_iterator = paginator.paginate()
    print("Gathering log groups...")

    for page in page_iterator:
        for group in page["logGroups"]:
            log_group_name = group["logGroupName"]
            if "retentionInDays" in group.keys():
                log_group_retention = group["retentionInDays"]
                if log_group_retention == DAYS_TO_KEEP_LOGS:
                    print(f"Retention period is already correct for log group: {log_group_name}")
                    continue
            print(f"Setting retention to {DAYS_TO_KEEP_LOGS} on log group: {log_group_name}")
            client.put_retention_policy(
                logGroupName=log_group_name,
                retentionInDays=DAYS_TO_KEEP_LOGS,
            )
