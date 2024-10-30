from client import create_native_client
from google.protobuf.empty_pb2 import Empty


def main():
    client = create_native_client()
    request = Empty()
    response = client.GetVehicles(request)
    print(response)

     
if __name__ == "__main__":
    main()
