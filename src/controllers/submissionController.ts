import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Submission from '../types/submission';

const dbFilePath = path.join(__dirname, '../db.json');

const getSubmissions = (): Submission[] => {
    const data = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data);
};

const saveSubmissions = (submissions: Submission[]): void => {
    fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2), 'utf8');
};

const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPhoneNumber = (phone: string): boolean => {
    // Validate phone number format (exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
};

const isValidGithubLink = (github_link: string): boolean => {
    // Validate GitHub link regex
    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9-]+(\/[a-zA-Z0-9-]+)*\/?$/;
    return githubRegex.test(github_link);
};

export const ping = (req: Request, res: Response): void => {
    res.send(true);
};

export const submit = (req: Request, res: Response): void => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;

    // Validate inputs
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
    }

    if (!isValidPhoneNumber(phone)) {
        res.status(400).json({ error: 'Phone number must be 10 digits long' });
        return;
    }

    if (!isValidGithubLink(github_link)) {
        res.status(400).json({ error: 'Invalid GitHub link' });
        return;
    }

    try {
        const submissions = getSubmissions();
        const submission = {
            id: uuidv4(),
            name,
            email,
            phone,
            github_link,
            stopwatch_time,
            created_at: new Date(),
            updated_at: new Date()
        };
        submissions.push(submission);
        saveSubmissions(submissions);
        res.status(200).json({ message: 'Submission successful', submission });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while submitting your form' });
    }
};

export const read = (req: Request, res: Response): void => {
    try {
        const { index } = req.query;
        const submissions = getSubmissions();
        const idx = parseInt(index as string, 10);
        if (idx >= 0 && idx < submissions.length) {
            res.status(200).json({ submission: submissions[idx] });
        } else {
            res.status(404).json({ error: 'Submission not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while reading the submission' });
    }
};

export const deleteSubmission = (req: Request, res: Response): void => {
    try {
        const { index } = req.body;
        const submissions = getSubmissions();
        const idx = parseInt(index, 10);
        if (idx >= 0 && idx < submissions.length) {
            const [submission] = submissions.splice(idx, 1);
            saveSubmissions(submissions);
            res.status(200).json({ message: 'Submission deleted', submission });
        } else {
            res.status(404).json({ error: 'Submission not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the submission' });
    }
};

export const editSubmission = (req: Request, res: Response): void => {
    const { index, name, email, phone, github_link, stopwatch_time } = req.body;

    // Validate inputs
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
    }

    if (!isValidPhoneNumber(phone)) {
        res.status(400).json({ error: 'Phone number must be 10 digits long' });
        return;
    }

    if (!isValidGithubLink(github_link)) {
        res.status(400).json({ error: 'Invalid GitHub link' });
        return;
    }

    try {
        const submissions = getSubmissions();
        const idx = parseInt(index, 10);
        if (idx >= 0 && idx < submissions.length) {
            const submission = submissions[idx];
            submission.name = name;
            submission.email = email;
            submission.phone = phone;
            submission.github_link = github_link;
            submission.stopwatch_time = stopwatch_time;
            submission.updated_at = new Date();
            saveSubmissions(submissions);
            res.status(200).json({ message: 'Submission updated', submission });
        } else {
            res.status(404).json({ error: 'Submission not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the submission' });
    }
};

export const searchByEmail = (req: Request, res: Response): void => {
    try {
        const { email } = req.query;
        const submissions = getSubmissions();
        const results = submissions.filter(submission => submission.email === email);
        res.status(200).json({ submissions: results, count: results.length });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching for submissions' });
    }
};
