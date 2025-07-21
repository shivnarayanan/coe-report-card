from database import engine
from models import Base

if __name__ == "__main__":
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("All tables dropped.") 