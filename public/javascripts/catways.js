/**
 * Confirme et envoie la suppression d'un catway
 * @param {string} catwayNumber - numéro du catway à supprimer
 */
function confirmDelete(catwayNumber) {
    if (confirm('Êtes-vous sûr de vouloir supprimer le catway n°' + catwayNumber + ' ?')) {
        const form  = document.createElement('form');
        form.method = 'POST';
        form.action = '/catways/' + catwayNumber + '/delete';
        document.body.appendChild(form);
        form.submit();
    }
}
