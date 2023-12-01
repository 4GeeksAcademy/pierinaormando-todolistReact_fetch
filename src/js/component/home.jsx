import React, { useEffect, useState } from "react";

const Home = () => {
	const [inputValue, setInputValue] = useState("");
	const [toDos, setToDos] = useState([]);
	const [taskIndex, setTaskIndex] = useState(null);

	const user = 'pierinaormando';
	const url = 'https://playground.4geeks.com/apis/fake/todos';

	const createUser = async () => {
		const urlUser = url + '/user/' + user;
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify([]),
		};

		const response = await fetch(urlUser, options);
		if (response.ok) {
			const data = await response.json();
			console.log(data);
		} else {
			console.error('Error (createUser)', response.status, response.statusText);
		}
	};

	const deleteUser = async () => {
		const urlUser = url + '/user/' + user;
		const options = {
			method: "DELETE"
		};

		try {
			const response = await fetch(urlUser, options);
			if (response.ok) {
				const data = await response.json();
				console.log(data);
			} else {
				console.error('Error (deleteUser)', response.status, response.statusText);
				// manejar la eliminación local en caso de un error, lo mismo para los demas metodos
				setToDos([]);
			}
		} catch (error) {
			console.error('Error en la solicitud (deleteUser):', error);
			// manejar la eliminación local en caso de un error, lo mismo para los demas metodos
			setToDos([]);
		}
	}



	const updateTask = async (newTask) => {
		const urlUser = url + '/user/' + user;

		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify([...toDos, newTask])
		};

		try {
			const response = await fetch(urlUser, options);
			if (response.ok) {
				const data = await response.json();
				console.log(data);
			} else {
				console.error('Error (updateTask): ', response.status, response.statusText);
				setToDos([...toDos, newTask]);
			}
		} catch (error) {
			console.error('Error en la solicitud (updateTask):', error);
			setToDos([...toDos, newTask]);
		}
	};


	const addTask = (event) => {
		if (event && event.preventDefault) {
		   event.preventDefault();
		}
	 
		if (inputValue.trim() === "") {
		   return;
		}
	 
		const newTask = { label: inputValue, done: false };
		setToDos([...toDos, newTask]);
		updateTask(newTask);
		setInputValue("");
	 };
	 

	const deleteTask = async (index) => {
		const deletedTask = toDos[index];
		setToDos(toDos.filter((t, currentIndex) => index !== currentIndex));

		const urlUser = url + '/user/' + user;
		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(toDos.filter((t, currentIndex) => index !== currentIndex))
		};

		try {
			const response = await fetch(urlUser, options);
			if (response.ok) {
				const data = await response.json();
				console.log(data);
			} else {
				console.error('Error (deleteTask - update API):', response.status, response.statusText);
				setToDos([...toDos, deletedTask]);
			}
		} catch (error) {
			console.error('Error en la solicitud (deleteTask - update API):', error);
			setToDos([...toDos, deletedTask]);
		}
	};

	const getTasks = async () => {
		const urlUser = url + '/user/' + user;
		const options = {
			method: "GET"
		};

		try {
			const response = await fetch(urlUser, options);
			if (response.ok) {
				const data = await response.json();
				setToDos(data);
			} else {
				console.error('Error (getTasks):', response.status, response.statusText);
				setToDos([]);
			}
		} catch (error) {
			console.error('Error en la solicitud (getTasks):', error);
			setToDos([]);
		}
	};


	useEffect(() => {
		getTasks();
	}, []);


	return (
		<div className="text-center container">
			<h1>ToDoList</h1>
			<button type="button" className="btn btn-success m-2" onClick={createUser}>
				Create User
			</button>
			<button type="button" className="btn btn-danger m-2" onClick={deleteUser}>
				Delete User
			</button>
			<ul>
				<li>
					<input
						type="text"
						placeholder="What do you need to do?"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && addTask()}
					/>
				</li>
				{toDos.map((task, index) => (
					<li
						key={index}
						onMouseEnter={() => setTaskIndex(index)}
						onMouseLeave={() => setTaskIndex(null)}
					>
						{task.label}
						{taskIndex === index && (
							<i
								className="far fa-trash-alt m-1"
								onClick={() => deleteTask(index)}
							></i>
						)}
					</li>
				))}
			</ul>
			<div className="tasks">{toDos.length} item left</div>
		</div>
	);
};

export default Home;
