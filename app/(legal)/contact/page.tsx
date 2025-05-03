export default function Contact() {
    return (
      <section
        aria-labelledby="contact-heading"
        className="mx-auto max-w-7xl px-4 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <h1
            id="contact-heading"
            className="mb-12 text-4xl text-center font-bold tracking-tight text-pretty text-gray-900"
          >
            Contact
          </h1>
  
          <p className="mb-7 leading-7 text-gray-700">
            If you run into any issues, have any questions, or wish to provide
            feedback, feel free to reach out:
          </p>
  
          <address className="space-y-3 not-italic leading-7 text-gray-700">
            <p>
              <strong className="mr-2">Email:</strong>
              <a
                href="mailto:rawgrittt@gmail.com"
                className="text-sky-600 hover:text-sky-700"
              >
                rawgrittt@gmail.com
              </a>
            </p>
  
            <p>
              <strong className="mr-2">Phone / WhatsApp:</strong>
              <a
                href="tel:+919717710958"
                className="text-sky-600 hover:text-sky-700"
              >
                +91&nbsp;97177&nbsp;10958
              </a>
            </p>
          </address>
        </div>
      </section>
    );
  }