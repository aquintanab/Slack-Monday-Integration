# Slack-Monday-Integration
Slack-Monday-Integration
An automation tool that integrates Slack notifications with Monday.com boards. This integration allows users to mark specific Slack messages with a reaction/sticker and automatically create corresponding entries in a Monday.com board.
Features

Monitors Slack channels for specific reactions on messages
Extracts match information from messages
Creates new items in a Monday.com board with match details
Supports configurable reaction types and board mappings

Benefits

Reduces administrative tasks by at least 10%
Improves precision in notification tracking
Eliminates duplicate efforts
Ensures information is always synchronized between platforms

Getting Started
Prerequisites

Node.js (v14 or higher)
NPM (v6 or higher)
Monday.com account with admin permissions
Slack workspace with admin permissions

Installation

Clone this repository:
git clone https://github.com/aquintanab/Slack-Monday-Integration.git
cd Slack-Monday-Integration

Install dependencies:
npm install

Create a .env file in the root directory with your configuration:
MONDAY_API_TOKEN=your_monday_api_token
MONDAY_CLIENT_ID=your_monday_client_id
MONDAY_CLIENT_SECRET=your_monday_client_secret
MONDAY_BOARD_ID=your_monday_board_id

SLACK_API_TOKEN=your_slack_bot_token
SLACK_SIGNING_SECRET=your_slack_signing_secret

PORT=3000

Start the application:
npm start


For development:
npm run dev
Configuration
See the Setup Guide for detailed instructions on configuring the integration.
License
This project is licensed under the MIT License - see the LICENSE file for details.
