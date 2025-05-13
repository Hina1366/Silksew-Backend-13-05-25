const asyncHandler = require("express-async-handler")
const Issue = require("../models/issueModel")

exports.getIssues = asyncHandler(async (req, res) => {
  const pageSize = 5
  const page = Number(req.query.page) || 1

  const count = await Issue.countDocuments()
  const issues = await Issue.find()
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 })

  res.json({
    issues,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  })
})

exports.getIssueById = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id)
  if (issue) {
    res.json(issue)
  } else {
    res.status(404)
    throw new Error("Issue not found")
  }
})

exports.createIssue = asyncHandler(async (req, res) => {
  const { recipientId, recipientName, issue, related } = req.body

  const newIssue = await Issue.create({
    recipientId,
    recipientName,
    issue,
    related,
    status: "Unresolved",
  })

  res.status(201).json(newIssue)
})

exports.updateIssueStatus = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id)

  if (issue) {
    issue.status = req.body.status || issue.status
    const updatedIssue = await issue.save()
    res.json(updatedIssue)
  } else {
    res.status(404)
    throw new Error("Issue not found")
  }
})

