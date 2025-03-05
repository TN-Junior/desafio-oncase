import pytest
from app import create_app, db
from app.models import Participant

@pytest.fixture(scope='module')
def test_client():

    app = create_app()
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


    with app.app_context():
        db.create_all()


    yield app.test_client()

    with app.app_context():
        db.drop_all()


def test_post_participant_validation(test_client):
    invalid_participant = {
        "firstName": "",
        "lastName": "",
        "participation": 150
    }

    response = test_client.post('/participants', json=invalid_participant)
    assert response.status_code == 400
    assert 'First name is required' in response.json['error']
    assert 'Last name is required' in response.json['error']
    assert 'Participation must be a number between 1 and 100' in response.json['error']



def test_put_participant(test_client):
    new_participant = {
        "firstName": "John",
        "lastName": "Doe",
        "participation": 80
    }


    response = test_client.post('/participants', json=new_participant)
    participant_id = response.json['participant']['id']


    updated_participant = {
        "firstName": "Jane",
        "lastName": "Doe",
        "participation": 90
    }

    response = test_client.put(f'/participants/{participant_id}', json=updated_participant)
    assert response.status_code == 200
    assert response.json['message'] == 'Participant updated successfully'
    assert response.json['participant']['firstName'] == "Jane"
    assert response.json['participant']['participation'] == 90

def test_delete_participant(test_client):
    new_participant = {
        "firstName": "John",
        "lastName": "Doe",
        "participation": 75
    }

    response = test_client.post('/participants', json=new_participant)
    participant_id = response.json['participant']['id']


    response = test_client.delete(f'/participants/{participant_id}')
    assert response.status_code == 200
    assert f'Participant with ID {participant_id} deleted successfully' in response.json['message']

def test_reset_participants(test_client):
    response = test_client.delete('/participants')
    assert response.status_code == 200
    assert 'Participants reset successfully' in response.json['message']
