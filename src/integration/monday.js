// src/integrations/monday.js
// Monday.com API integration

const { graphql } = require('@mondaydotcom/apps-sdk');
const { config } = require('../config');
const logger = require('../utils/logger');

// Function to create a new item in Monday.com board
async function createMondayItem(matchDetails) {
  try {
    const { boardId, itemName, columnValues } = prepareItemData(matchDetails);
    
    // Create the item in Monday.com
    const query = `mutation($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
      create_item(board_id: $boardId, item_name: $itemName, column_values: $columnValues) {
        id
      }
    }`;
    
    const variables = {
      boardId,
      itemName,
      columnValues: JSON.stringify(columnValues)
    };
    
    const response = await graphql(query, { variables });
    logger.info('Created Monday.com item:', response.data.create_item.id);
    return response.data.create_item.id;
  } catch (error) {
    logger.error('Error creating Monday item:', error);
    throw error;
  }
}

// Function to prepare item data for Monday.com
function prepareItemData(matchDetails) {
  // The board ID from configuration
  const boardId = config.MONDAY_BOARD_ID;
  
  // Use match name as the item name
  const itemName = matchDetails.matchName;
  
  // Format date for Monday.com (YYYY-MM-DD)
  let dateValue = matchDetails.date;
  if (dateValue && !dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // If date is not in YYYY-MM-DD format, try to format it
    const date = new Date(dateValue);
    dateValue = date.toISOString().split('T')[0];
  }
  
  // Format column values based on your Monday.com board structure
  // You'll need to adjust these column IDs to match your actual board
  const columnValues = {
    status: { label: matchDetails.priority ? "Priority" : "Pending" },
    date: { date: dateValue },
    text: matchDetails.details || "" 
  };
  
  return { boardId, itemName, columnValues };
}

// Get board columns to understand the structure
async function getBoardColumns(boardId = config.MONDAY_BOARD_ID) {
  try {
    const query = `query($boardId: ID!) {
      boards(ids: [$boardId]) {
        columns {
          id
          title
          type
        }
      }
    }`;
    
    const variables = {
      boardId
    };
    
    const response = await graphql(query, { variables });
    return response.data.boards[0].columns;
  } catch (error) {
    logger.error('Error fetching board columns:', error);
    throw error;
  }
}

module.exports = {
  createMondayItem,
  prepareItemData,
  getBoardColumns
};
