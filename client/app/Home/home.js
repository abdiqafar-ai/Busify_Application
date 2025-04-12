import Navbar from "../components/Navbar";

export default function Landing() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 font-sans">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content: extra top padding to clear the fixed Navbar */}
      <main className="pt-32">
        {/* HERO SECTION */}
        <section className="flex flex-col items-center justify-center px-4 md:px-8 pb-12">
          <div className="text-center space-y-8 max-w-7xl w-full">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-600 to-yellow-400 bg-clip-text text-transparent leading-tight">
              Book Your Bus Journey with Ease
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover affordable and reliable intercity bus services. Book now
              and embark on a seamless travel experience.
            </p>

            {/* HORIZONTAL SEARCH CARD */}
            <div className="bg-white shadow-2xl rounded-2xl p-6 flex flex-col md:flex-row items-center justify-center gap-4 w-full overflow-x-auto">
              <input
                type="text"
                placeholder="Departure City"
                className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[160px]"
              />
              <input
                type="text"
                placeholder="Destination City"
                className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[160px]"
              />
              <input
                type="date"
                className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[160px]"
              />
              <select className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[160px]">
                <option>Standard</option>
                <option>Luxury</option>
                <option>AC</option>
                <option>Non-AC</option>
              </select>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl hover:brightness-110 transition duration-300 whitespace-nowrap"
              >
                Search Buses
              </button>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION - with cards */}
        <section id="about" className="py-16 px-4 md:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">
              About Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: Our Mission */}
              <div className="bg-gray-50 rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-orange-600 mb-4">
                  Our Mission
                </h3>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  At DriveNow, we are on a mission to transform the way you
                  travel. Our platform merges technology, comfort, and
                  affordability to deliver an exceptional bus booking
                  experience.
                </p>
              </div>
              {/* Card 2: Our Commitment */}
              <div className="bg-gray-50 rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-orange-600 mb-4">
                  Our Commitment
                </h3>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  Founded by travel enthusiasts, we bring years of industry
                  expertise and a commitment to customer satisfaction. We
                  partner with trusted and verified bus operators, ensuring
                  every journey is safe and seamless.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION - presented as cards */}
        <section id="services" className="py-16 px-4 md:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
              Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 transition transform hover:scale-105">
                <h3 className="text-2xl font-semibold text-orange-600 mb-4">
                  Online Bus Booking
                </h3>
                <p className="text-lg text-gray-600">
                  Easily search, compare, and reserve your bus seat in real
                  time. Our intuitive interface and detailed itineraries
                  guarantee a hassle-free booking process.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 transition transform hover:scale-105">
                <h3 className="text-2xl font-semibold text-orange-600 mb-4">
                  Secure Payments
                </h3>
                <p className="text-lg text-gray-600">
                  Our secure payment gateways support multiple options, ensuring
                  safe and seamless transactions every time you book your
                  journey.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 transition transform hover:scale-105">
                <h3 className="text-2xl font-semibold text-orange-600 mb-4">
                  Real-Time Tracking
                </h3>
                <p className="text-lg text-gray-600">
                  Stay informed with live bus tracking and real-time journey
                  updates directly on your mobile device or desktop.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 transition transform hover:scale-105">
                <h3 className="text-2xl font-semibold text-orange-600 mb-4">
                  24/7 Customer Support
                </h3>
                <p className="text-lg text-gray-600">
                  Our dedicated support team is available around the clock to
                  ensure that your travel experience is smooth and enjoyable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED BUSES SECTION */}
        <section className="py-16 bg-gray-50 text-center px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Buses</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { name: "Modern Coast", type: "Luxury AC", price: "Ksh 1,200" },
              { name: "EasyCoach", type: "Standard AC", price: "Ksh 1,000" },
              { name: "Mash Poa", type: "VIP", price: "Ksh 1,800" },
            ].map((bus, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow-md transition transform hover:scale-105"
              >
                <img src="/mashpoa.svg" className="rounded-xl mb-4" alt="Bus" />
                <h3 className="font-semibold">{bus.name}</h3>
                <p className="text-sm text-gray-600">{bus.type}</p>
                <p className="text-blue-600 font-bold mt-2">{bus.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section className="py-16 bg-white text-center px-4">
          <h2 className="text-3xl font-bold mb-8">Passenger Reviews</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <p className="italic">
                "Booked my trip from Nairobi to Kisumu in minutes. Super smooth
                experience and friendly service!"
              </p>
              <p className="mt-4 font-semibold">— Amina W.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <p className="italic">
                "The bus was modern, comfortable, and the booking process was
                flawless. Highly recommend DriveNow!"
              </p>
              <p className="mt-4 font-semibold">— John M.</p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-16 bg-gray-50 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            {[
              {
                q: "How do I pay for my ticket?",
                a: "You can pay using M-Pesa, credit/debit cards, or at the station.",
              },
              {
                q: "Can I reschedule my journey?",
                a: "Yes, changes can be made up to 6 hours before departure.",
              },
              {
                q: "Do I need to print my ticket?",
                a: "No, just show your e-ticket or SMS confirmation at boarding.",
              },
            ].map((faq, i) => (
              <details key={i} className="mb-4 border-b pb-2">
                <summary className="font-semibold cursor-pointer">
                  {faq.q}
                </summary>
                <p className="text-gray-600 mt-2">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CONTACT SECTION - World-Class Cards + Form */}
        <section id="contact" className="py-20 bg-white px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
              Contact Us
            </h2>

            {/* Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Email Card */}
              <div className="bg-orange-50 rounded-2xl shadow-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-orange-600 mb-2">
                  Email
                </h3>
                <p className="text-gray-700">
                  <a href="mailto:support@drivenow.com" className="underline">
                    support@drivenow.com
                  </a>
                </p>
              </div>

              {/* Phone Card */}
              <div className="bg-orange-50 rounded-2xl shadow-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-orange-600 mb-2">
                  Phone
                </h3>
                <p className="text-gray-700">
                  <a href="tel:+1234567890" className="underline">
                    +1 (234) 567-890
                  </a>
                </p>
              </div>

              {/* Address Card */}
              <div className="bg-orange-50 rounded-2xl shadow-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-orange-600 mb-2">
                  Address
                </h3>
                <p className="text-gray-700">
                  123 Travel Lane, Suite 456
                  <br />
                  Nairobi, Kenya
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Send Us a Message
              </h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-gray-600">Full Name</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 text-gray-600">Message</label>
                  <textarea
                    rows="5"
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Type your message here..."
                  ></textarea>
                </div>
                <div className="md:col-span-2 text-center">
                  <button
                    type="submit"
                    className="bg-orange-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-orange-700 transition"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="bg-blue-600 py-12 text-center text-white px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Travel?</h2>
          <p className="mb-6">
            Book your seat today and experience a new standard in bus travel.
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-100 transition">
            Book Now
          </button>
        </section>

        {/* FOOTER */}
        <footer className="py-8 bg-gray-800 text-white text-center px-4">
          <p>&copy; 2025 SwiftBus. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Support
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
