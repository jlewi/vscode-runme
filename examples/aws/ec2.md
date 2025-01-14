---
runme:
  id: 01HV6WCDJJZYCVX89YE825JGSF
  version: v3
---

# AWS EC2 Cloud Renderers

AWS EC2 enables you to deploy cloud-native applications with top-tier security, performance, and reliability.

Discover how you can leverage Runme's robust Notebook Cloud Renderers to engage with your EC2 resources in ways you've never imagined before!

💡 **Important!** Be sure to run through the one-time guide [Getting started with Runme Noteboks for AWS](setup.md).

## List EC2 Instances

One of the fundamental tasks in working with EC2 is to list your instances, serving as the foundation for other operations such as managing instance states —starting, stopping, rebooting, or terminating them— or securely connecting via SSH.

Runme seamlessly integrates with your AWS EC2 resource URLs, mirroring your navigation in the AWS Console directly within your Notebook. This eliminates the need to open the console separately; instead, you can access its functionality right within your Notebook file!

Experience it firsthand by running the following URL to see Runme in action:

```sh {"id":"01HQRAF82SC4YPTNRGQ2TZ7DK2"}
https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#Instances
```

Isn't that cool? that's a **Runme cloud renderer** in Action!

When your AWS Credentials are correctly configured, you'll encounter a table resembling the one found in the AWS Console, showcasing essential details such as:

- Instance name
- State
- Type
- Availability Zone
- DNS Configuration
- Security groups
- Platform
- Launch time
- Actions (Secure SSH connection, access instance details)

You will also find useful links to the AWS Console like:

- Instances
- Launch instance
- Open EC2 Dashboard

## Display specific EC2 Instance

Just as with listing instances, if you execute an AWS Console link for specific instance details, you'll dive into a similar experience that offers a comprehensive breakdown of the instance's details.

💡 **Pro tip:** With the EC2 List instances actions column, you can effortlessly visualize instance details by clicking on the view instance details icon, eliminating the need to manually paste a specific instance console URL.

For a quick demo of visualizing a specific EC2 instance details, you can replace the instanceId placeholder with the instance you want to visualize:

```sh {"background":"false","id":"01HQRAK03KBKPSZ47CRDDFJWDV"}
https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#InstanceDetails:instanceId=<REPLACE_WITH_INSTANCE_ID>
```

## Connect to EC2 instance via SSH

You can leverage the AWS CLI to connect securely via SSH to a EC2 instance, run the following commands:

```sh {"id":"01HV6XT7E79H95RB7NSTX1GCN0","promptEnv":"yes","terminalRows":"4"}
export EC2_INSTANCE_ID=
echo "Configured EC2 Instance is $EC2_INSTANCE_ID"
```

Now that you have the instance configured, run the following command to connect:

```sh {"background":"true","id":"01HQRAMMXGPYTFGQDMREZHNB37","terminalRows":"25"}
aws ec2-instance-connect ssh --instance-id $EC2_INSTANCE_ID
```

### Feedback welcome!

Do you have feedback or new ideas ? what about more Runme Cloud renderers for AWS features ?
Feel free to [reach out to us](https://github.com/stateful/runme?tab=readme-ov-file#feedback)