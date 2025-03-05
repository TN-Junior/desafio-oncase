import pytest
from app import create_app, db
from app.models import Participant

@pytest.fixture(scope='module')
def test_client():

    app = create_app()
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db' 
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


    with app.app_context(): 
        db.create_all()


    yield app.test_client()

    with app.app_context():
        db.drop_all() 


def test_create_participant(test_client):

    with test_client.application.app_context():  
        new_participant = Participant(
            first_name="John",
            last_name="Doe",
            participation=85
        )

        db.session.add(new_participant)
        db.session.commit()


        participant = Participant.query.get(new_participant.id)
        assert participant is not None
        assert participant.first_name == "John"
        assert participant.last_name == "Doe"
        assert participant.participation == 85


def test_participant_retrieval(test_client):

    with test_client.application.app_context():
        new_participant = Participant(
            first_name="Jane",
            last_name="Smith",
            participation=90
        )

        db.session.add(new_participant)
        db.session.commit()


        participant = Participant.query.get(new_participant.id)
        assert participant.first_name == "Jane"
        assert participant.last_name == "Smith"
        assert participant.participation == 90


def test_participant_update(test_client):

    with test_client.application.app_context():
        new_participant = Participant(
            first_name="John",
            last_name="Doe",
            participation=75
        )

        db.session.add(new_participant)
        db.session.commit()

    
        new_participant.first_name = "Johnny"
        new_participant.participation = 95
        db.session.commit()

        participant = Participant.query.get(new_participant.id)
        assert participant.first_name == "Johnny"
        assert participant.participation == 95


def test_participant_deletion(test_client):

    with test_client.application.app_context():
        new_participant = Participant(
            first_name="Mark",
            last_name="Twain",
            participation=70
        )

        db.session.add(new_participant)
        db.session.commit()

        db.session.delete(new_participant)
        db.session.commit()


        participant = Participant.query.get(new_participant.id)
        assert participant is None


def test_invalid_participant(test_client):

    with test_client.application.app_context():
        try:
            invalid_participant = Participant(
                first_name="",
                last_name="Doe",
                participation=120  #
            )
            db.session.add(invalid_participant)
            db.session.commit()
            pytest.fail("Expected ValueError due to invalid data")
        except ValueError as e:
            assert str(e) == "First name and last name cannot be empty" or "Participation must be between 1 and 100"
