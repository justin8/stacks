import boto3
client = boto3.client('logs')

DAYS_TO_KEEP_LOGS = 7

def main(event, context):
    log_groups = client.describe_log_groups()["logGroups"]
    print("Gathered log groups...")

    for group in log_groups:
        log_group_name = group["logGroupName"]
        print(f"Setting retention to {DAYS_TO_KEEP_LOGS} on log group: {log_group_name}")
        client.put_retention_policy(
            logGroupName=log_group_name,
            retentionInDays=DAYS_TO_KEEP_LOGS,
        )
