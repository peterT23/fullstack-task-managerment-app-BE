const express = require("express");
const router = express.Router();

/**
 * @route POST /references
 * @description Save a reference document to task or comment
 * @body { targetType: 'task' or 'Comment', targetId, name, referenceDocumentUrl }
 * @access Login required
 */

/**
 * @route PUT /references/:id
 * @description edit a reference document to task or comment
 * @body {  name, referenceDocumentUrl }
 * @access Login required
 */

/**
 * @route delete /references/:id
 * @description delete a reference document of task or comment
 * @access Login required
 */

/**
 * @route Get /references/:id
 * @description get single reference
 * @access Login required
 */

module.exports = router;
