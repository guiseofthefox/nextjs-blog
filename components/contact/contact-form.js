import classes from './contact-form.module.css';
import {useRef, useState, useEffect} from "react";
import Notification from "../ui/notification";

async function sendContactData(contactDetails) {
    const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(contactDetails),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
    }

}

function ContactForm() {
    const emailInputRef = useRef();
    const nameInputRef = useRef();
    const messageInputRef = useRef();

    const [requestStatus, setRequestStatus] = useState('');
    const [requestError, setRequestError] = useState('');

    useEffect(() => {
        if (requestStatus === 'success' || requestStatus === 'error') {
            const timer = setTimeout(() => {
                setRequestStatus('');
                setRequestError('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [requestStatus]);

    async function sendMessageHandler(event) {
        event.preventDefault();

        const enteredEmail = emailInputRef.current.value;
        const enteredName = nameInputRef.current.value;
        const enteredMessage = messageInputRef.current.value;

        const reqBody = {
            email: enteredEmail,
            name: enteredName,
            message: enteredMessage
        }

        setRequestStatus('pending');

        try {
            await sendContactData(reqBody);
            setRequestStatus('success');
            emailInputRef.current.value = '';
            nameInputRef.current.value = '';
            messageInputRef.current.value = '';
        } catch (error) {
            setRequestStatus('error');
            setRequestError(error.message);
        }

    }

    let notification;
    switch (requestStatus) {
        case 'pending':
            notification = {
                status: 'pending',
                title: 'Sending message...',
                message: 'Your message is on its way!'
            };
            break;
        case 'success':
            notification = {
                status: 'success',
                title: 'Success!',
                message: 'Message sent successfully!'
            };
            break;
        case 'error':
            notification = {
                status: 'error',
                title: 'Error!',
                message: requestError
            }
            break;
        default:
            notification = null;
            break;
    }

    return (
        <section className={classes.contact}>
            <form className={classes.form}>
                <div className={classes.controls}>
                    <div className={classes.control}>
                        <label htmlFor='email'>Your Email</label>
                        <input type="email" id='email' ref={emailInputRef} required/>
                    </div>
                    <div className={classes.control}>
                        <label htmlFor='name'>Your Name</label>
                        <input type="text" id='name' ref={nameInputRef} required/>
                    </div>
                </div>
                <div className={classes.control}>
                    <label htmlFor='message'>Your Message</label>
                    <textarea id='message' rows='5' ref={messageInputRef} required></textarea>
                </div>
                <div className={classes.actions}>
                    <button onClick={sendMessageHandler}>Send Message</button>
                </div>
            </form>
            {notification && <Notification
                status={notification.status}
                title={notification.title}
                message={notification.message}
            />}
        </section>
    );
}

export default ContactForm;