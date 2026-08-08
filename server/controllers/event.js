import Event from "../models/event.js";
import User from "../models/user.js";
import mongoose from "mongoose";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ startTime: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrl,
      venue,
      startTime,
      endTime,
      registrationDeadline,
      totalSeats,
      entryFee,
      status,
      showWinner,
      sponsors,
      media,
      requiredFields,
      customFields,
      allowedPrograms,
      allowedYears,
      provideCertificate,
      clubId,
      clubName,
    } = req.body;

    if (!title || !venue || !startTime || !endTime) {
      return res.status(400).json({ message: "Title, venue, start time and end time are required." });
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await Event.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    const createdByUserId = req.user
      ? req.user._id
      : typeof req.body.createdBy === "string"
      ? req.body.createdBy
      : req.body.createdBy?.userId || null;

    const event = new Event({
      title,
      description,
      imageUrl: imageUrl || (Array.isArray(media) && media.find((m) => m.url)?.url) || "",
      venue,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
      totalSeats: Number(totalSeats || 0),
      registeredCount: 0,
      entryFee: Number(entryFee || 0),
      status: status || "UPCOMING",
      showWinner: Boolean(showWinner),
      winners: [],
      sponsors: Array.isArray(sponsors) ? sponsors : [],
      media: Array.isArray(media) ? media : [],
      requiredFields: Array.isArray(requiredFields) ? requiredFields : [],
      customFields: Array.isArray(customFields) ? customFields : [],
      allowedPrograms: Array.isArray(allowedPrograms) ? allowedPrograms : ["BTECH", "MTECH", "OTHER"],
      allowedYears: Array.isArray(allowedYears) ? allowedYears : [],
      provideCertificate: Boolean(provideCertificate),
      slug,
      club: {
        clubId: clubId || "",
        clubName: clubName || "",
      },
      createdBy: {
        userId: createdByUserId ? String(createdByUserId) : "",
        clubName: clubName || "",
      },
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error("Create Event Error:", error);
    if (error.code === 11000 && error.keyValue?.slug) {
      return res.status(400).json({ message: "Event slug already exists." });
    }
    res.status(500).json({ message: error.message || "Failed to create event" });
  }
};

export const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const event = mongoose.Types.ObjectId.isValid(slug)
      ? await Event.findById(slug)
      : await Event.findOne({ slug });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const registrations = await Event.find({ "registrations.userId": userId });
    return res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { studentId, externalEmail, externalName, formResponses } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const already = event.registrations?.some(
      (reg) =>
        (studentId && reg.userId === studentId) ||
        (externalEmail && reg.externalEmail === externalEmail)
    );

    if (already) {
      return res.status(400).json({ message: "Already registered for this event." });
    }

    const isFull = event.totalSeats && event.registeredCount >= event.totalSeats;
    const status = isFull ? "WAITLISTED" : "REGISTERED";

    event.registrations = event.registrations || [];
    event.registrations.push({
      userId: studentId || null,
      externalEmail: externalEmail || null,
      externalName: externalName || null,
      formResponses: formResponses || {},
      status,
    });

    if (!isFull) {
      event.registeredCount += 1;
    }

    await event.save();

    return res.json({
      status,
      message: isFull
        ? "Added to waitlist"
        : "Registered successfully",
      qrCode: "SAMPLE_QR_CODE",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete event" });
  }
};