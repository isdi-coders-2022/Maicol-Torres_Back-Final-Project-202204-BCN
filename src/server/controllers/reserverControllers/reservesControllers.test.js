const Reserve = require("../../../db/models/Reserve/Reserve");
const User = require("../../../db/models/User/User");
const { reservesReadyMock } = require("../../mocks/reservesReadyMock");

const {
  getReserves,
  deleteReserve,
  createReserve,
  editReserve,
} = require("./reservesControllers");

describe("Given a reservesControllers functionk", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  describe("When invoked with mthod response and status 200", () => {
    test("Then it should call the method and response", async () => {
      const req = {
        body: { reservesReadyMock },
      };
      const expecStatus = 200;
      Reserve.find = jest.fn().mockResolvedValue(false);

      await getReserves(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expecStatus);
    });
  });

  describe("when its called with reserves not found", () => {
    test("Then it should call next", async () => {
      const next = jest.fn();
      const error = { code: 404, customMessage: "reserves not found" };

      Reserve.find = jest.fn().mockRejectedValue({});
      await getReserves(null, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a deleteCheck controller", () => {
  describe("When it's invoqued with a response and a request with an id to delete", () => {
    test("Then it should call the response's status method with 200 and the json method with a 'Check deleted' message", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const req = { params: { idReserve: 54 } };

      Reserve.findByIdAndDelete = jest.fn().mockResolvedValue();

      await deleteReserve(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: "Reserve deleted" });
    });
  });

  describe("When it's invoqued with a response and a request with a invalid id to delete", () => {
    test("Then it should call the response's status method with 404 and the json method with a 'No check with that id found' message", async () => {
      const next = jest.fn();
      const req = { params: { idReserve: 55 } };
      const expectedError = {
        customMessage: "No Reserve with that id found",
        code: 404,
      };

      Reserve.findByIdAndDelete = jest.fn().mockRejectedValue({});
      await deleteReserve(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a createReserve controller", () => {
  const name = "mariamar";
  const password = "123456";
  const numberPersons = 15;
  const hour = 19;
  const date = "19/03/2022";

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const req = {
    userId: "1974",
    body: {
      name,
      password,
    },
  };
  describe("When it's invoqued with a user Id, a name, cdate , hour and numberPersons", () => {
    test("Then it should call the response's status method with 201 and the new object created", async () => {
      const expectedObjectCreated = {
        name,
        date,
        hour,
        numberPersons,
      };

      Reserve.create = jest.fn().mockResolvedValue(expectedObjectCreated);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue({});

      await createReserve(req, res, null);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedObjectCreated);
    });
  });
});

describe("Given a editReserve controller", () => {
  const ReserveId = "1974";
  const name = "mariamar";
  const numberPersons = 15;
  const hour = 19;
  const date = "19/03/2022";

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const req = {
    params: { ReserveId },
    body: {
      name,
      date,
      hour,
      numberPersons,
    },
  };
  describe("When it's invoqued with a name, date, hour, numberPersons a id of the reserve to edit", () => {
    test("Then it should call the response's status method with 200 and the new object edited", async () => {
      const noteToEdit = {
        author: name,
      };
      const newReserve = {
        name,
        date,
        hour,
        numberPersons,
        author: name,
      };

      Reserve.findById = jest.fn().mockResolvedValue(noteToEdit);
      Reserve.findByIdAndUpdate = jest.fn().mockResolvedValue({});
      Reserve.findById = jest.fn().mockResolvedValue(newReserve);

      await editReserve(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
