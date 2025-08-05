const express = require("express")
const mongoose = require("mongoose")
const app = express()
const router = express.Router()
const cors = require("cors")

app.use(cors())

app.use(express.json())

app.use("/api", router)

mongoose.connect("mongodb://localhost:27017/forms", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err))

const formSchema = new mongoose.Schema({
  name: String,
  applicant: String,
  status: String,
  action: String,
  action_href: String
})

const Form = mongoose.model("Form", formSchema)

router.get("/health", (_, res) => {
  res.send("OK")
})

router.get("/get", async (_, res) => {
  try {
    const forms = await Form.find()
    res.json(forms)
  } catch (error) {
    res.status(500).json({ error: "Database error" })
  }
})

router.get("/delete", async (req, res) => {
  const query = {}

  if (req.query.name) query.name = { $regex: req.query.name.trim(), $options: "i" }
  if (req.query.applicant) query.applicant = { $regex: req.query.applicant.trim(), $options: "i" }
  if (req.query.status) query.status = { $regex: req.query.status.trim(), $options: "i" }
  if (req.query.action) query.action = { $regex: req.query.action.trim(), $options: "i" }
  if (req.query.action_href) query.action_href = { $regex: req.query.action_href.trim(), $options: "i" }

  if (Object.keys(query).length === 0) {
    return res.status(400).json({ error: "En az bir parametre verilmeli" })
  }

  try {
    const deleted = await Form.findOneAndDelete(query)
    if (!deleted) {
      return res.status(404).json({ error: "Form bulunamadı" })
    }
    res.json({ success: true, message: "Form silindi", deleted })

  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası", details: err.message })
  }
})

router.get("/create", async (req, res) => {
  const { name, applicant, status, action, action_href } = req.query

  if (!name || !applicant || !status || !action || !action_href) {
    return res.status(400).json({ error: "Tüm alanlar (name, applicant, status, action, action_href) gereklidir" })
  }

  const newForm = new Form({
    name: name.trim(),
    applicant: applicant.trim(),
    status: status.trim(),
    action: action.trim(),
    action_href: action_href.trim()
  })

  try {
    const saved = await newForm.save()
    res.json({ success: true, message: "Form oluşturuldu", form: saved })
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası", details: err.message })
  }
})

router.get("/edit", async (req, res) => {
  const { id, name, applicant, status, action, action_href } = req.query

  if (!id) {
    return res.status(400).json({ error: "ID parametresi gereklidir" })
  }

  const updateData = {}

  if (name) updateData.name = name.trim()
  if (applicant) updateData.applicant = applicant.trim()
  if (status) updateData.status = status.trim()
  if (action) updateData.action = action.trim()
  if (action_href) updateData.action_href = action_href.trim()

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: "Güncellenecek en az bir alan belirtilmeli" })
  }

  try {
    const updatedForm = await Form.findByIdAndUpdate(id, updateData, { new: true })

    if (!updatedForm) {
      return res.status(404).json({ error: "Form bulunamadı" })
    }

    res.json({ success: true, message: "Form güncellendi", form: updatedForm })

  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası", details: err.message })
  }
})


app.listen(3001, () => console.log("Backend is running at http://localhost:3001"))