import unittest
import json
import os
from app import app, DATA_FILE

class SarvalokhAppTestCase(unittest.TestCase):
    def setUp(self):
        """Set up testing client and config."""
        app.config['TESTING'] = True
        self.app = app.test_client()
        # Backup existing RFQ database if present
        self.data_backup = None
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    self.data_backup = f.read()
                os.remove(DATA_FILE)
            except Exception:
                pass

    def tearDown(self):
        """Restore database backups."""
        if os.path.exists(DATA_FILE):
            try:
                os.remove(DATA_FILE)
            except Exception:
                pass
        if self.data_backup is not None:
            try:
                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    f.write(self.data_backup)
            except Exception:
                pass

    def test_homepage_loads(self):
        """Verify the homepage serves successfully and contains the brand text."""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        html_content = response.data.decode('utf-8')
        self.assertIn('SARVALOKH', html_content)
        self.assertIn('OFFICIAL EXPORT CATALOG', html_content)
        self.assertIn('Vannamei Whiteleg Shrimp', html_content)

    def test_submit_rfq_success(self):
        """Verify that submitting a valid RFQ yields success and saves the record."""
        valid_data = {
            'company_name': 'Test Imports LLC',
            'contact_name': 'Jane Importer',
            'email': 'jane@testimports.com',
            'phone': '+123456789',
            'destination_port': 'Port of Hamburg',
            'product_type': 'Vannamei Whiteleg Shrimp',
            'processing_format': 'HLSO',
            'size_grading': '16/20',
            'freezing_format': 'IQF (Individually Quick Frozen)',
            'glazing': '10% Glaze',
            'notes': 'Looking for immediate delivery of 2 containers.'
        }
        
        response = self.app.post(
            '/submit-rfq',
            data=json.dumps(valid_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data.decode('utf-8'))
        self.assertTrue(result['success'])
        self.assertIn('rfq_id', result)
        self.assertIn('submitted', result['message'].lower())

        # Verify that the JSON file contains the record
        self.assertTrue(os.path.exists(DATA_FILE))
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            rfqs = json.load(f)
        self.assertEqual(len(rfqs), 1)
        self.assertEqual(rfqs[0]['company_name'], 'Test Imports LLC')
        self.assertEqual(rfqs[0]['destination_port'], 'Port of Hamburg')

    def test_submit_rfq_validation_error(self):
        """Verify that submitting an invalid RFQ yields 400 and validation errors."""
        invalid_data = {
            'company_name': '',  # missing
            'contact_name': 'Jane Importer',
            'email': 'invalid-email-format',  # invalid format
            'destination_port': '',  # missing
            'product_type': 'Black Tiger Prawns',
            'processing_format': 'HOSO',
            'size_grading': ''  # missing
        }
        
        response = self.app.post(
            '/submit-rfq',
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        result = json.loads(response.data.decode('utf-8'))
        self.assertFalse(result['success'])
        self.assertIn('errors', result)
        
        # Check specific validation errors
        errors = result['errors']
        self.assertIn('company_name', errors)
        self.assertIn('email', errors)
        self.assertIn('destination_port', errors)
        self.assertIn('size_grading', errors)
        self.assertNotIn('contact_name', errors)

if __name__ == '__main__':
    unittest.main()
