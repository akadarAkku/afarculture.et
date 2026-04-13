  <?php
// =============================================
// FILE LOCATION: /api/save-content.php
// PURPOSE: Backend API for saving content
// =============================================

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input');
    file_put_contents('../assets/data/content.json', $data);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
}
?>
