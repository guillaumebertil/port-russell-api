/**
 * Confirme et envoie la suppression d'une réservation
 * @param {string} id - ID de la réservation à supprimer
 */
function confirmDelete(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
        const form  = document.createElement('form');
        form.method = 'POST';
        form.action = `/reservations/${id}/delete`;
        document.body.appendChild(form);
        form.submit();
    }
}