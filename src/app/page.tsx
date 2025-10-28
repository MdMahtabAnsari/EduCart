"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const courses = [
	{
		title: "Full Stack Web Development",
		description:
			"Master MERN Stack and build production-grade apps with projects and career guidance.",
		image: "/images/web-dev.jpg",
		price: "$49",
		rating: 4.8,
		students: "12.4k",
		tags: ["MERN", "Projects", "Career"],
	},
	{
		title: "Data Structures & Algorithms",
		description:
			"Crack interviews — learn problem patterns, complexity analysis and practice sets.",
		image: "/images/dsa-course.jpg",
		price: "$39",
		rating: 4.7,
		students: "9.1k",
		tags: ["DSA", "Interviews", "Practice"],
	},
	{
		title: "UI/UX Design Essentials",
		description:
			"Design beautiful, usable interfaces and prototypes — Figma-focused workflow.",
		image: "/images/uiux-course.jpg",
		price: "$29",
		rating: 4.6,
		students: "6.8k",
		tags: ["Figma", "Prototyping", "Portfolio"],
	},
];

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
			{/* Hero */}
			<header className="py-20 px-6 md:px-20">
				<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
							Learn modern tech, build your future.
							<span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
								Courses designed for real careers.
							</span>
						</h1>
						<p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mb-8">
							Practical, project-based courses with hands-on mentorship and
							real-world interview prep. Start learning today — no fluff, just
							results.
						</p>
						<div className="flex gap-4">
							<Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow">
								Browse Courses
							</Button>
							<Button variant="outline" className="px-6 py-3 rounded-lg">
								Learn More
							</Button>
						</div>
						<div className="mt-6 flex gap-6 text-sm text-slate-500 dark:text-slate-400">
							<div>
								<strong className="text-slate-900 dark:text-slate-100">
									50k+
								</strong>
								<div>Students</div>
							</div>
							<div>
								<strong className="text-slate-900 dark:text-slate-100">
									120+
								</strong>
								<div>Projects</div>
							</div>
							<div>
								<strong className="text-slate-900 dark:text-slate-100">
									4.7
								</strong>
								<div>Avg rating</div>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className="hidden md:block"
					>
						<div className="relative rounded-2xl overflow-hidden shadow-2xl">
							<Image
								src="/images/hero.jpg"
								alt="Hero"
								width={720}
								height={480}
								className="object-cover"
							/>
						</div>
					</motion.div>
				</div>
			</header>

			{/* Courses */}
			<main className="py-16 px-6 md:px-20">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-3xl font-semibold text-center mb-8">
						Popular Courses
					</h2>
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{courses.map((course, idx) => (
							<motion.div
								key={course.title}
								whileHover={{ scale: 1.02 }}
								className="rounded-xl"
								transition={{ type: "spring", stiffness: 260, damping: 20 }}
							>
								<Card className="overflow-hidden border-0 shadow-lg">
									<div className="relative h-48 w-full">
										<Image
											src={course.image}
											alt={course.title}
											fill
											className="object-cover"
											sizes="(max-width: 768px) 100vw, 33vw"
											priority={idx === 0}
										/>
										<div className="absolute top-3 left-3 bg-white/80 dark:bg-black/60 text-xs rounded-full px-3 py-1 font-medium">
											{course.tags[0]}
										</div>
									</div>

									<CardContent className="p-5">
										<div className="flex justify-between items-start mb-2">
											<h3 className="text-lg font-semibold">{course.title}</h3>
											<span className="text-blue-600 font-bold">
												{course.price}
											</span>
										</div>

										<p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
											{course.description}
										</p>

										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<div className="flex items-center text-yellow-500">
													<Star className="w-4 h-4" />
													<span className="ml-1 font-medium">
														{course.rating}
													</span>
												</div>
												<div className="text-sm text-slate-500">
													· {course.students} students
												</div>
											</div>

											<Button size="sm" className="rounded-full px-4 py-2">
												Enroll
											</Button>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</main>

			{/* Testimonials */}
			<section className="bg-slate-50 dark:bg-slate-900 py-16 px-6 md:px-20">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-3xl font-semibold text-center mb-10">
						What Our Students Say
					</h2>
					<div className="grid gap-6 md:grid-cols-3">
						{[
							{
								quote:
									"This platform helped me build a portfolio and land interviews. Instructors are excellent.",
								name: "Sarah Johnson",
							},
							{
								quote:
									"Hands-on projects and clear explanations. Highly recommend for career switchers.",
								name: "Ahmed Khan",
							},
							{
								quote:
									"Structured learning paths and useful mentorship — great value for money.",
								name: "Priya Sharma",
							},
						].map((t, i) => (
							<Card key={i} className="p-6">
								<div className="flex gap-2 mb-3">
									{[...Array(5)].map((_, idx) => (
										<Star key={idx} className="w-4 h-4 text-yellow-400" />
									))}
								</div>
								<p className="text-slate-700 dark:text-slate-300 mb-4">
									“{t.quote}”
								</p>
								<h4 className="font-semibold">{t.name}</h4>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Footer */}
			<footer className="py-16 px-6 md:px-20">
				<div className="max-w-6xl mx-auto bg-linear-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4">
					<div>
						<h3 className="text-2xl font-bold">
							Ready to start your learning journey?
						</h3>
						<p className="text-slate-100/90 mt-1">
							Join thousands of students and level up your career.
						</p>
					</div>
					<div className="flex gap-4">
						<Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg">
							Get Started
						</Button>
						<Button
							variant="outline"
							className="text-white border-white/30 px-6 py-3 rounded-lg"
						>
							Contact Sales
						</Button>
					</div>
				</div>
			</footer>
		</div>
	);
}
