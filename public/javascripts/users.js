/**
 * Confirme et envoie la suppression d'un utilisateur
 * @param {string} email - email de l'utilisateur à supprimer
 */
function confirmDelete(email) {
    console.log('delete clicked');
    if (confirm('Êtes-vous sûr de vouloir supprimer l\'utilisateur ' + email + ' ?')) {
        const form  = document.createElement('form');
        form.method = 'POST';
        form.action = '/users/' + encodeURIComponent(email) + '/delete';
        document.body.appendChild(form);
        form.submit();
    }
}

/**
 * Vérifie la correspondance des mots de passe lors de la création
 * ou de la modification d'un utilisateur
 */
document.querySelector('form').addEventListener('submit', function (e) {
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    // Vérifie uniquement si un mot de passe est saisi
    if (password && password !== passwordConfirm) {
        e.preventDefault();
        alert('Les mots de passe ne correspondent pas');
    }
});
