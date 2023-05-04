exports.getUniqueId = (users) => {
	const usersIds = users.map(user => user._id)
	const maxId = usersIds.reduce((a, b) =>Math.max(a,b))
	const uniqueId = maxId + 1
	return uniqueId
}
